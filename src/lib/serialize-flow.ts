import { type Node } from "./create-node.ts";

export interface SerializedNode {
    id: string;
    name: string;
    type: string;
    properties: Record<string, any>;
    connections: string[];
}

export interface SerializedFlow {
    nodes: SerializedNode[];
    startNode: string;
}

/**
 * Serializes a flow graph to JSON starting from a given node
 * @param startNode - The starting node of the flow
 * @returns A JSON representation of the entire flow graph
 */
export const serializeFlow = (startNode: Node): SerializedFlow => {
    const visitedNodes = new Set<string>();
    const serializedNodes: SerializedNode[] = [];

    const extractNodeProperties = (node: Node): Record<string, any> => {
        return structuredClone(node.properties || {});
    };

    const traverseNode = (node: Node): void => {
        if (!node || visitedNodes.has(node.name)) {
            return;
        }

        visitedNodes.add(node.name);

        // Get connected children using children() method to avoid infinite recursion
        const connectedChildren = node.children();
        const connections = connectedChildren.map((child: any) => child.name);

        // Extract properties
        const properties = extractNodeProperties(node);

        // Create serialized node
        const serializedNode: SerializedNode = {
            id: node.name,
            name: node.name,
            type: node.type,
            properties,
            connections
        };

        serializedNodes.push(serializedNode);

        // Recursively traverse connected nodes
        connectedChildren.forEach((child: any) => {
            traverseNode(child);
        });
    };

    // Start traversal from the given node
    traverseNode(startNode);

    return {
        nodes: serializedNodes,
        startNode: startNode.name
    };
};

/**
 * Converts a serialized flow to a pretty-printed JSON string
 * @param flow - The serialized flow object
 * @returns A formatted JSON string
 */
export const flowToJson = (flow: SerializedFlow): string => {
    return JSON.stringify(flow, null, 2);
};

/**
 * Convenience function that takes a starting node and returns a JSON string representation
 * @param startNode - The starting node of the flow
 * @returns A formatted JSON string representing the entire flow
 */
export const nodeToFlowJson = (startNode: Node): string => {
    const serializedFlow = serializeFlow(startNode);
    return flowToJson(serializedFlow);
};
