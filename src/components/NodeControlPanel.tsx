import React, { useState } from "react";
import { createNode, removeNode, sendMessage, moveNode } from "../api/simulationApi";
import { useSimulationState } from "../context/SimulationContext";
import {
    Container,
    Grid2,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Box,
} from "@mui/material";

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

    const { state } = useSimulationState();
    // Convert the nodes object into an array.
    const nodes = Object.values(state.nodes);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, color: "white" }}>
            {/* Create Node Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "#424242",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Create Node
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 6 }}>
                        <TextField
                            label="Latitude"
                            type="number"
                            variant="outlined"
                            value={lat}
                            onChange={(e) => setLat(Number(e.target.value))}
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                        <TextField
                            label="Longitude"
                            type="number"
                            variant="outlined"
                            value={long}
                            onChange={(e) => setLong(Number(e.target.value))}
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Button variant="contained" color="primary" onClick={handleCreate} fullWidth>
                            Create Node
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>

            {/* Remove Node Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "#424242",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Remove Node
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="remove-node-label" sx={{ color: "white" }}>
                                Node ID
                            </InputLabel>
                            <Select
                                labelId="remove-node-label"
                                label="Node ID"
                                value={nodeId}
                                onChange={(e) => setNodeId(Number(e.target.value))}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                }}
                            >
                                {nodes.map((node) => (
                                    <MenuItem key={node.node_id} value={node.node_id}>
                                        {node.node_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Button variant="contained" color="secondary" onClick={handleRemove} fullWidth>
                            Remove Node
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>

            {/* Send Message Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "#424242",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Send Message
                </Typography>
                <Grid2 container spacing={2}>

                    <Grid2 size={{ xs: 4 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="send-node-label" sx={{ color: "white" }}>
                                Sender Node ID
                            </InputLabel>
                            <Select

                                labelId="send-node-label"
                                label="Sender Node ID"
                                value={senderNodeId}
                                onChange={(e) => setSenderNodeId(Number(e.target.value))}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                }}
                            >
                                {nodes.map((node) => (
                                    <MenuItem key={node.node_id} value={node.node_id}>
                                        {node.node_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="dest-node-label" sx={{ color: "white" }}>
                                Destination Node ID
                            </InputLabel>
                            <Select

                                labelId="dest-node-label"
                                label="Destination Node ID"
                                value={destNodeId}
                                onChange={(e) => setDestNodeId(Number(e.target.value))}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                }}
                            >
                                {nodes.map((node) => (
                                    <MenuItem key={node.node_id} value={node.node_id}>
                                        {node.node_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <TextField
                            label="Message"
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Button variant="contained" color="primary" onClick={handleSendMessage} fullWidth>
                            Send Message
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>

            {/* Move Node Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "#424242",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Move Node
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 4 }}>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="move-node-label" sx={{ color: "white" }}>
                                Node ID
                            </InputLabel>
                            <Select

                                labelId="move-node-label"
                                label="Move Node ID"
                                value={moveNodeId}
                                onChange={(e) => setMoveNodeId(Number(e.target.value))}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white",
                                    },
                                }}
                            >
                                {nodes.map((node) => (
                                    <MenuItem key={node.node_id} value={node.node_id}>
                                        {node.node_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <TextField
                            label="New Latitude"
                            type="number"
                            variant="outlined"
                            value={latMove}
                            onChange={(e) => setLatMove(Number(e.target.value))}
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <TextField
                            label="New Longitude"
                            type="number"
                            variant="outlined"
                            value={longMove}
                            onChange={(e) => setLongMove(Number(e.target.value))}
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Button variant="contained" color="secondary" onClick={handleMove} fullWidth>
                            Move Node
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
    );
};


export default NodeControlPanel;