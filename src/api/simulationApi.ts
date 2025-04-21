const apiBaseUrl = "/nodeAPI"

export async function createNode(lat: number, long: number): Promise<string> {
    const response = await fetch(`${apiBaseUrl}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, long }),
    })
    if (!response.ok) {
        throw new Error(`Failed to create node: ${response.statusText}`);
    }
    return response.text();
}

export async function removeNode(nodeId: number): Promise<string> {
    const response = await fetch(`${apiBaseUrl}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId }),
    });
    if (!response.ok) {
        throw new Error(`Failed to remove node: ${response.statusText}`);
    }
    return response.text();
}


export async function sendMessage(senderNodeId: number, destinationNodeID: number, message: string): Promise<string> {
    const response = await fetch(`${apiBaseUrl}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: senderNodeId, dest_node_id: destinationNodeID, message: message }),
    });
    if (!response.ok) {
        throw new Error(`Failed to execute send message command: ${response.statusText}`);
    }
    return response.text();
}

export async function moveNode(nodeId: number, lat: number, long: number): Promise<string> {
    const response = await fetch(`${apiBaseUrl}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, lat: lat, long: long }),
    });
    if (!response.ok) {
        throw new Error(`Failed to move node: ${response.statusText}`)
    }
    return response.text();
}

// Create a new user on a given node
export async function createUser(nodeId: number): Promise<any> {
    const res = await fetch("/userAPI/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId }),
    });
    return res.json();
}

// Delete a user from a given node
export async function deleteUser(nodeId: number, userId: number): Promise<any> {
    const res = await fetch("/userAPI/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, user_id: userId }),
    });
    return res.json();
}

// Send a message from one user to another
export async function sendUserMessage(
    nodeId: number,
    userId: number,
    destUserId: number,
    message: string
): Promise<any> {
    const res = await fetch("/userAPI/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            node_id: nodeId,
            user_id: userId,
            dest_user_id: destUserId,
            message,
        }),
    });
    return res.json();
}

// Move a user from one node to another
export async function moveUser(
    nodeId: number,
    userId: number,
    otherNodeId: number
): Promise<any> {
    const res = await fetch("/userAPI/moveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            node_id: nodeId,
            user_id: userId,
            other_node_id: otherNodeId,
        }),
    });
    return res.json();
}
