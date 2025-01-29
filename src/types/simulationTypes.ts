/**
 * Data for a single routing entry in the routing table.
 */
export interface RouteEntry {
    hops: number | undefined; // number of hops
    via: string | undefined;  // which node to forward through
  }
  
  /**
   * Node representation in a single simulation "state".
   */
  export interface SimNode {
    id: string;
    x: number;
    y: number;
    routingTable: Record<string, RouteEntry>;
  }
  
  /**
   * A simulation "state" is a snapshot of all nodes after a given event.
   */
  export interface SimulationState {
    eventIndex: number;    // Which event in the sequence
    eventLogLine: string;  // The actual line from logs
    nodes: SimNode[];
  }
  