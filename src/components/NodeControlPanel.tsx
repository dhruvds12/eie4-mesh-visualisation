import React, { useState } from "react";
import { createNode, removeNode, sendMessage, moveNode } from "../api/simulationApi";

const NodeControlPanel: React.FC = () => {
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [nodeId, setNodeId] = useState('');

    const handleCreate = async () => {
        try {
            const result = await createNode(lat, long);
            console.log("Node created:", result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async () => {
        try {
            const result = await removeNode(nodeId);
            console.log("Node removed:", result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Create Node</h3>
            <input type="number" value={lat} onChange={(e) => setLat(Number(e.target.value))} placeholder="Latitude" />
            <input type="number" value={long} onChange={(e) => setLong(Number(e.target.value))} placeholder="Longitude" />
            <button onClick={handleCreate}>Create Node</button>

            <h3>Remove Node</h3>
            <input type="text" value={nodeId} onChange={(e) => setNodeId(e.target.value)} placeholder="Node ID" />
            <button onClick={handleRemove}>Remove Node</button>
        </div>
    );
};

export default NodeControlPanel;