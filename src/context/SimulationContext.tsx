import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Node struct
export interface NodeState {
  node_id: string;
  x: number; // x coorodinates of the node
  y: number; // y coordinates of the node
  routingTable: Record<string, { hops: number; via: string }>;
  virtual: boolean;
}


// Define the overall simulation state.
export interface SimulationState {
  nodes: Record<string, NodeState>;
  events: SimulationEvent[];
}

// Define an event type if you want to keep a log of events.
export interface SimulationEvent {
  type: string;
  payload: any;
  timestamp: number;
}

// Define the supported action types.
export type SimulationAction =
  | { type: 'NODE_JOINED'; payload: NodeState }
  | { type: 'NODE_LEFT'; payload: { node_id: string } }
  | {
    type: 'ADD_ROUTE_ENTRY';
    payload: {
      node_id: string;
      routing_table: {
        Destination: string;
        NextHop: string;
        HopCount: number;
      };
    };
  }
  | { type: 'MOVED_NODE'; payload: { node_id: string, x: number, y: number } }
  | {
    type: 'REMOVED_ROUTE_ENTRY';
    payload: {
      node_id: string;
      routing_table: {
        Destination: string;
        NextHop: string;
        HopCount: number;
      };
    };
  };

// The initial state for the simulation.
const initialState: SimulationState = {
  nodes: {},
  events: [],
};

// The reducer updates the simulation state in response to actions.a
function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'NODE_JOINED': {
      const newNode: NodeState = {
        ...action.payload,
        routingTable: action.payload.routingTable || {}
      };
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newNode.node_id]: newNode,
        },
        events: [...state.events, { type: action.type, payload: newNode, timestamp: Date.now() }],
      };
    }
    case 'NODE_LEFT': {
      const newNodes = { ...state.nodes };
      delete newNodes[action.payload.node_id];
      return {
        ...state,
        nodes: newNodes,
        events: [...state.events, { type: action.type, payload: action.payload, timestamp: Date.now() }],
      };
    }
    case 'ADD_ROUTE_ENTRY': {
      const { node_id, routing_table } = action.payload
      const newNodes = { ...state.nodes }

      if (newNodes[node_id]) {
        const currentRoutingTable = newNodes[node_id].routingTable
          ? { ...newNodes[node_id].routingTable } // if true take a copy
          : {}; // if false empty object

        currentRoutingTable[routing_table.Destination] = {
          hops: routing_table.HopCount,
          via: routing_table.NextHop,
        };

        newNodes[node_id] = {
          ...newNodes[node_id],
          routingTable: currentRoutingTable
        }
      } else {
        console.error(`Node ${node_id} not found for ROUTING_TABLE_UPDATED`);
      }
      return {
        ...state,
        nodes: newNodes,
        events: [...state.events, { type: action.type, payload: action.payload, timestamp: Date.now() }],
      };

    }
    case 'MOVED_NODE': {
      const newNodes = { ...state.nodes }
      if (newNodes[action.payload.node_id]) {
        newNodes[action.payload.node_id].x = action.payload.x
        newNodes[action.payload.node_id].y = action.payload.y
      } else {
        console.error(`Node ${action.payload.node_id} not found for MOVED_NODE`);
      }
      return {
        ...state,
        nodes: newNodes,
        events: [...state.events, { type: action.type, payload: action.payload, timestamp: Date.now() }],
      };
    }
    case 'REMOVED_ROUTE_ENTRY': {
      const { node_id, routing_table } = action.payload
      const newNodes = { ...state.nodes }

      if (newNodes[node_id]) {
        const currentRoutingTable = newNodes[node_id].routingTable
          ? { ...newNodes[node_id].routingTable }
          : {};

        delete currentRoutingTable[routing_table.Destination]

        newNodes[node_id] = {
          ...newNodes[node_id],
          routingTable: currentRoutingTable
        }
      } else {
        console.error(`Node ${node_id} not found for REMOVED_ROUTE_ENTRY`);
      }
      return {
        ...state,
        nodes: newNodes,
        events: [...state.events, { type: action.type, payload: action.payload, timestamp: Date.now() }]
      }
    }
    default:
      return state;
  }
}

// Create the context, provides the simulation state and the dispatch function to all components in the application tree
// Context is a way to pass data through the component tree without having to pass props down manually at each level.
interface SimulationContextType {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
}

// Create a context of simulation state and the dispatch function therefore these are available to all components in the application tree
const SimulationStateContext = createContext<SimulationContextType | undefined>(undefined);

// Prop (property) way to pass data froma  parent component to a child component 
// In this case the children prop is of type ReactNode therefore any valid react component can be the child and has access to context
interface SimulationProviderProps {
  children: ReactNode;
}

// wraps its children making the simulation and dispatch function available via the context
// Any component that is wrapped by simulationProvider can access context using useSimulationState
export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  useEffect(() => {
    // Open a WebSocket connection to your simulation server.
    const ws = new WebSocket(`ws://localhost:8080/ws`);

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data); // Log the incoming payload
        if (data.type === "NODE_JOINED") {
          // Ensure x and y are valid numbers
          if (typeof data.x !== 'number' || typeof data.y !== 'number') {
            console.error("Invalid coordinates in payload", data);
            return;
          }
          dispatch({ type: 'NODE_JOINED', payload: data });
        } else if (data.type === "NODE_LEFT") {
          dispatch({ type: 'NODE_LEFT', payload: data });
        } else if (data.type === "ADD_ROUTE_ENTRY") {
          dispatch({ type: 'ADD_ROUTE_ENTRY', payload: data })
        } else if (data.type === 'MOVED_NODE') {
          // console.log("Processing moved_node")
          dispatch({ type: 'MOVED_NODE', payload: data })
        } else if (data.type === 'REMOVED_ROUTE_ENTRY') {
          dispatch({ type: 'REMOVED_ROUTE_ENTRY', payload: data })
        }
      } catch (err) {
        console.error("Error processing event:", err);
      }
    };


    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed with code:", event.code);
    };

    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
      // causes websocket to disconnect and reconnect in Strict Mode this is because components get mounted, unmounted and mounted
    };
  }, []);

  return (
    // provides the context to it's children to access. 
    <SimulationStateContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationStateContext.Provider>
  );
};

export const useSimulationState = (): SimulationContextType => {
  const context = useContext(SimulationStateContext);
  if (context === undefined) {
    throw new Error("useSimulationState must be used within a SimulationProvider");
  }
  return context;
};
