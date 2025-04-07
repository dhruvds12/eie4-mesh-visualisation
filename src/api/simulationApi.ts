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

export async function removeNode(nodeId: string): Promise<string> {
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


export async function sendMessage(senderNodeId: string, destinationNodeID: string, message: string): Promise<string> {
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

export async function moveNode(nodeId: string, lat: number, long: number): Promise<string> {
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
