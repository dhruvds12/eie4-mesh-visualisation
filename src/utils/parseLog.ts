import { SimNode, SimulationState } from '../types/simulationTypes';

// Regex patterns for lines we care about
const createNodeRegex = /\[sim\]\s*Created new node ID:\s*([^,]+), x:\s*([\d.-]+), y:\s*([\d.-]+)/;
const directNeighborRegex = /\[routing table\].*Node\s+([^ ]+)\s+\(router\)\s*->\s*direct neighbor:\s*([^\s]+)/;
const updatedRouteRegex = /\[routing table\].*Node\s+([^ ]+)\s+\(router\)\s*->\s*updated route to\s+([^ ]+)\s+via\s+([^ ]+)\s+\(hop count\s+(\d+)\)/;
const removeNodeRegex = /\[sim\]\s*Node\s*([\w-]+):\s*leaving network\./;


/**
 * Parses the log string, producing an array of SimulationStates (snapshots).
 */
export function buildSimulationStates(logString: string): SimulationState[] {
  // Split logs by line
  const allLines = logString.split('\n');

  let currentNodes: SimNode[] = [];
  const states: SimulationState[] = [];
  let eventCount = 0;

  // Helper: find or create a node
  function getOrCreateNode(nodeId: string, x = 0, y = 0): SimNode {
    let node = currentNodes.find((n) => n.id === nodeId);
    if (!node) {
      node = {
        id: nodeId,
        x,
        y,
        routingTable: {}
      };
      currentNodes.push(node);
    }
    return node;
  }

  // Helper: delete node from currentNodes 
  function deleteNode(nodeId: string): void {
    currentNodes = currentNodes.filter((n) => n.id !== nodeId);
  }

  // Iterate over lines, looking for "[sim]"
  for (const line of allLines) {
    if (!line.includes('[sim]')) {
      continue; // skip non-simulation events
    }

    // Make a deep copy so each state is "frozen"
    currentNodes = JSON.parse(JSON.stringify(currentNodes));

    // New node created
    let match = line.match(createNodeRegex);
    if (match) {
      const nodeId = match[1].trim();
      const xVal = parseFloat(match[2]);
      const yVal = parseFloat(match[3]);
      const node = getOrCreateNode(nodeId);
      node.x = xVal;
      node.y = yVal;
    }

    // Direct neighbor
    match = line.match(directNeighborRegex);
    if (match) {
      const nodeId = match[1];
      const neighborId = match[2];
      getOrCreateNode(nodeId);
      getOrCreateNode(neighborId);

      const nodeRef = currentNodes.find((n) => n.id === nodeId)!;
      nodeRef.routingTable[neighborId] = {
        hops: 1,
        via: neighborId
      };
    }

    // Updated route
    match = line.match(updatedRouteRegex);
    if (match) {
      const nodeId = match[1];
      const destinationId = match[2];
      const viaId = match[3];
      const hopCount = parseInt(match[4], 10);

      getOrCreateNode(nodeId);
      getOrCreateNode(destinationId);
      getOrCreateNode(viaId);

      const nodeRef = currentNodes.find((n) => n.id === nodeId)!;
      nodeRef.routingTable[destinationId] = {
        hops: hopCount,
        via: viaId
      };
    }

    // Node leaving network
    match = line.match(removeNodeRegex);
    if (match) {
      const nodeId = match[1];
      deleteNode(nodeId);
    }

    // Push new snapshot
    states.push({
      eventIndex: eventCount,
      eventLogLine: line,
      nodes: currentNodes
    });
    eventCount++;
  }

  return states;
}
