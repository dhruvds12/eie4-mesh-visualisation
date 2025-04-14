import React, { useState } from "react";
import { createNode, removeNode, sendMessage, moveNode } from "../api/simulationApi";

const NodeControlPanel: React.FC = () => {
    const [lat, setLat] = useState(0);
    const [latMove, setLatMove] = useState(0);
    const [long, setLong] = useState(0);
    const [longMove, setLongMove] = useState(0);
    const [nodeId, setNodeId] = useState(0);
    const [moveNodeId, setMoveNodeId] = useState(0);
    const [senderNodeId, setSenderNodeId] = useState(0)
    const [destNodeId, setDestNodeId] = useState(0)
    const [message, setMessage] = useState('')

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

    const handleSendMessage = async () => {
        try {
            const result = await sendMessage(senderNodeId, destNodeId, message);
            console.log("Sent message", result);
        } catch (error) {
            console.error(error)
        }
    }

    const handleMove = async () => {
        try {
            const result = await moveNode(moveNodeId, latMove, longMove);
            console.log("Sent Move request", result);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h3>Create Node</h3>
            <input type="number" value={lat} onChange={(e) => setLat(Number(e.target.value))} placeholder="Latitude" />
            <input type="number" value={long} onChange={(e) => setLong(Number(e.target.value))} placeholder="Longitude" />
            <button onClick={handleCreate}>Create Node</button>

            <h3>Remove Node</h3>
            <input type="text" value={nodeId} onChange={(e) => setNodeId(Number(e.target.value))} placeholder="Node ID" />
            <button onClick={handleRemove}>Remove Node</button>

            <h3>Send Message</h3>
            <input type="text" value={senderNodeId} onChange={(e) => setSenderNodeId(Number(e.target.value))} placeholder="Sender Node ID"/>
            <input type="text" value={destNodeId} onChange={(e) => setDestNodeId(Number(e.target.value))} placeholder="Destination node ID"/>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message ..."/>
            <button onClick={handleSendMessage}>Send Message</button>

            <h3>Move Node</h3>
            <input type="text" value={moveNodeId} onChange={(e) => setMoveNodeId(Number(e.target.value))} placeholder="Node ID"/>
            <input type="number" value={latMove} onChange={(e) => setLatMove(Number(e.target.value))} placeholder="Latitude" />
            <input type="number" value={longMove} onChange={(e) => setLongMove(Number(e.target.value))} placeholder="Longitude" />
            <button onClick={handleMove}>Move Node</button>
        </div>
    );
};

export default NodeControlPanel;