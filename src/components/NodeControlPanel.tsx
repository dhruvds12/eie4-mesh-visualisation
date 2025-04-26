import React, { useState } from "react";
import {
    createNode,
    removeNode,
    sendMessage,
    moveNode,
    createUser,
    deleteUser,
    sendUserMessage,
    moveUser,
} from "../api/simulationApi";
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
} from "@mui/material";

const NodeControlPanel: React.FC = () => {
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [nodeId, setNodeId] = useState(0);
    const [senderNodeId, setSenderNodeId] = useState(0);
    const [destNodeId, setDestNodeId] = useState(0);
    const [message, setMessage] = useState("");
    const [latMove, setLatMove] = useState(0);
    const [longMove, setLongMove] = useState(0);
    const [moveNodeId, setMoveNodeId] = useState(0);

    const [createUserNodeId, setCreateUserNodeId] = useState(0);
    const [deleteUserNodeId, setDeleteUserNodeId] = useState(0);
    const [deleteUserId, setDeleteUserId] = useState(0);

    const [sendUserNodeId, setSendUserNodeId] = useState(0);
    const [sendUserId, setSendUserId] = useState(0);
    const [destUserId, setDestUserId] = useState(0);
    const [userMsg, setUserMsg] = useState("");

    const [moveUserNodeId, setMoveUserNodeId] = useState(0);
    const [moveUserId, setMoveUserId] = useState(0);
    const [moveTargetNodeId, setMoveTargetNodeId] = useState(0);

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

    const handleCreateUser = async () => {
        try {
            const res = await createUser(createUserNodeId);
            console.log("User created:", res);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await deleteUser(deleteUserNodeId, deleteUserId);
            console.log("User deleted:", res);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSendUserMessage = async () => {
        try {
            const res = await sendUserMessage(
                sendUserNodeId,
                sendUserId,
                destUserId,
                userMsg
            );
            console.log("User message sent:", res);
        } catch (e) {
            console.error(e);
        }
    };

    const handleMoveUser = async () => {
        try {
            const res = await moveUser(
                moveUserNodeId,
                moveUserId,
                moveTargetNodeId
            );
            console.log("User moved:", res);
        } catch (e) {
            console.error(e);
        }
    };


    const { state } = useSimulationState();
    // Convert the nodes object into an array.
    const nodes = Object.values(state.nodes);

    const allUsers = nodes.flatMap((n) => n.users);

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

            {/* ─── Create User ──────────────────────────────────────────────────────── */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: "#424242", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Create User</Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Node ID</InputLabel>
                    <Select
                        value={createUserNodeId}
                        onChange={(e) => setCreateUserNodeId(Number(e.target.value))}
                    >
                        {nodes.map((n) => (
                            <MenuItem key={n.node_id} value={n.node_id}>{n.node_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleCreateUser} fullWidth>
                    Create User
                </Button>
            </Paper>

            {/* ─── Delete User ──────────────────────────────────────────────────────── */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: "#424242", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Delete User</Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Node ID</InputLabel>
                    <Select
                        value={deleteUserNodeId}
                        onChange={(e) => setDeleteUserNodeId(Number(e.target.value))}
                    >
                        {nodes.map((n) => (
                            <MenuItem key={n.node_id} value={n.node_id}>{n.node_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>User ID</InputLabel>
                    <Select
                        value={deleteUserId}
                        onChange={(e) => setDeleteUserId(Number(e.target.value))}
                    >
                        {(state.nodes[deleteUserNodeId]?.users || []).map((u) => (
                            <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="secondary" onClick={handleDeleteUser} fullWidth>
                    Delete User
                </Button>
            </Paper>

            {/* ─── Send User→User Message ──────────────────────────────────────────── */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: "#424242", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Send User Message</Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>From Node</InputLabel>
                    <Select
                        value={sendUserNodeId}
                        onChange={(e) => setSendUserNodeId(Number(e.target.value))}
                    >
                        {nodes.map((n) => (
                            <MenuItem key={n.node_id} value={n.node_id}>{n.node_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>From User</InputLabel>
                    <Select
                        value={sendUserId}
                        onChange={(e) => setSendUserId(Number(e.target.value))}
                    >
                        {(state.nodes[sendUserNodeId]?.users || []).map((u) => (
                            <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>To User</InputLabel>
                    <Select
                        value={destUserId}
                        onChange={(e) => setDestUserId(Number(e.target.value))}
                    >
                        {allUsers.map((u) => (
                            <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Message"
                    variant="outlined"
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSendUserMessage} fullWidth>
                    Send User Message
                </Button>
            </Paper>

            {/* ─── Move User ───────────────────────────────────────────────────────── */}
            <Paper elevation={3} sx={{ p: 2, backgroundColor: "#424242", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Move User</Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>From Node</InputLabel>
                    <Select
                        value={moveUserNodeId}
                        onChange={(e) => setMoveUserNodeId(Number(e.target.value))}
                    >
                        {nodes.map((n) => (
                            <MenuItem key={n.node_id} value={n.node_id}>{n.node_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>User ID</InputLabel>
                    <Select
                        value={moveUserId}
                        onChange={(e) => setMoveUserId(Number(e.target.value))}
                    >
                        {(state.nodes[moveUserNodeId]?.users || []).map((u) => (
                            <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>To Node</InputLabel>
                    <Select
                        value={moveTargetNodeId}
                        onChange={(e) => setMoveTargetNodeId(Number(e.target.value))}
                    >
                        {nodes.map((n) => (
                            <MenuItem key={n.node_id} value={n.node_id}>{n.node_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="secondary" onClick={handleMoveUser} fullWidth>
                    Move User
                </Button>
            </Paper>
        </Container>
    );
};


export default NodeControlPanel;