import { type Node } from "./create-node.ts";
import { createBatchNode } from "../nodes/flow/create-batch-node.ts";
import { createDelayNode } from "../nodes/flow/create-delay-node.ts";
import { createPassThroughNode } from "../nodes/flow/create-passthrough-node.ts";
import { createRateLimitingNode } from "../nodes/flow/create-rate-limiting-node.ts";
import { createReadFileNode } from "../nodes/storage/create-read-file-node.ts";
import { createWriteFileNode } from "../nodes/storage/create-write-file-node.ts";
import { createWatchFileNode } from "../nodes/storage/create-watch-file-node.ts";
import { createDebuggerNode } from "../nodes/create-debugger-node.ts";
import { createFunctionNode } from "../nodes/create-function-node.ts";
import { createHtmlSelectorNode } from "../nodes/create-html-selector-node.ts";
import { createHttpRequestNode } from "../nodes/create-http-request-node.ts";
import { createRandomNumberNode } from "../nodes/create-random-number-node.ts";
import { createSendSimpleMailNode } from "../nodes/create-send-simple-mail-node.ts";
import { createTemplateNode } from "../nodes/create-template-node.ts";
import { createCronNode } from "../nodes/create-cron-node.ts";

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

// Node factory mapping
type NodeFactory = (name: string, properties?: any) => Node;

const nodeFactories: Record<string, NodeFactory> = {
    'batchNode': createBatchNode,
    'delayNode': createDelayNode,
    'passThroughNode': createPassThroughNode,
    'rateLimitingNode': createRateLimitingNode,
    'readFileNode': createReadFileNode,
    'writeFileNode': createWriteFileNode,
    'watchFileNode': createWatchFileNode,
    'debuggerNode': createDebuggerNode,
    'functionNode': createFunctionNode,
    'htmlSelectorNode': createHtmlSelectorNode,
    'httpRequestNode': createHttpRequestNode,
    'randomNumberNode': createRandomNumberNode,
    'sendSimpleMailNode': createSendSimpleMailNode,
    'templateNode': createTemplateNode,
    'cronNode': createCronNode,
};

/**
 * Deserializes a flow from JSON format back to connected Node instances
 * @param serializedFlow - The serialized flow object
 * @returns The starting node of the recreated flow
 */
export const deserializeFlow = (serializedFlow: SerializedFlow): Node => {
    const nodeMap = new Map<string, Node>();

    // First pass: create all nodes
    serializedFlow.nodes.forEach(serializedNode => {
        const factory = nodeFactories[serializedNode.type];
        if (!factory) {
            throw new Error(`Unknown node type: ${serializedNode.type}`);
        }

        const node = factory(serializedNode.name, serializedNode.properties);
        nodeMap.set(serializedNode.name, node);
    });

    // Second pass: establish connections
    serializedFlow.nodes.forEach(serializedNode => {
        const sourceNode = nodeMap.get(serializedNode.name);
        if (!sourceNode) {
            throw new Error(`Source node not found: ${serializedNode.name}`);
        }

        // Connect to all target nodes
        serializedNode.connections.forEach(targetName => {
            const targetNode = nodeMap.get(targetName);
            if (!targetNode) {
                throw new Error(`Target node not found: ${targetName}`);
            }
            sourceNode.to(targetNode);
        });
    });

    // Return the start node
    const startNode = nodeMap.get(serializedFlow.startNode);
    if (!startNode) {
        throw new Error(`Start node not found: ${serializedFlow.startNode}`);
    }

    return startNode;
};

/**
 * Convenience function that takes a JSON string and returns the starting node of a recreated flow
 * @param jsonString - A JSON string representing a serialized flow
 * @returns The starting node of the recreated flow
 */
export const flowFromJson = (jsonString: string): Node => {
    const serializedFlow: SerializedFlow = JSON.parse(jsonString);
    return deserializeFlow(serializedFlow);
};
