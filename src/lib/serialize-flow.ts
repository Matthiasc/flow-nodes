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
    isTrigger?: boolean;
}

export interface SerializedFlow {
    nodes: SerializedNode[];
    startNodes: string[];
}

/**
 * Result of deserializing a flow, containing trigger nodes and all nodes
 */
export interface DeserializedFlow {
    triggerNodes: Node[];
    allNodes: Map<string, Node>;
    getNode: (name: string) => Node | undefined;
    startFlow: () => void;
    stopFlow: () => void;
    startTrigger: (nodeName: string) => void;
    stopTrigger: (nodeName: string) => void;
}


/**
 * Serializes a flow graph starting from given nodes, detecting trigger nodes automatically
 * @param nodes - Array of nodes in the flow (can be any nodes, trigger nodes will be auto-detected)
 * @returns A JSON representation of the entire flow graph
 */
export const serializeFlow = (nodes: Node[]): SerializedFlow => {
    const visitedNodes = new Set<string>();
    const serializedNodes: SerializedNode[] = [];
    const allNodes = new Set<Node>();

    const extractNodeProperties = (node: Node): Record<string, any> => {
        return structuredClone(node.properties || {});
    };

    // Collect all nodes in the flow by traversing from each provided node
    const collectAllNodes = (node: Node): void => {
        if (!node || allNodes.has(node)) {
            return;
        }
        allNodes.add(node);

        // Traverse children
        node.children().forEach((child: any) => {
            collectAllNodes(child);
        });
    };

    // Collect all nodes starting from provided nodes
    nodes.forEach(node => collectAllNodes(node));

    // Serialize all nodes
    allNodes.forEach(node => {
        const connectedChildren = node.children();
        const connections = connectedChildren.map((child: any) => child.name);
        const properties = extractNodeProperties(node);
        const isTrigger = isTriggerNode(node);

        const serializedNode: SerializedNode = {
            id: node.name,
            name: node.name,
            type: node.type,
            properties,
            connections,
            isTrigger
        };

        serializedNodes.push(serializedNode);
    });

    // Find trigger nodes (nodes that have start/stop methods)
    const triggerNodeNames = serializedNodes
        .filter(node => node.isTrigger)
        .map(node => node.name);

    // If no trigger nodes found, treat first provided node as start node (backward compatibility)
    const startNodes = triggerNodeNames.length > 0 ? triggerNodeNames : [nodes[0].name];

    return {
        nodes: serializedNodes,
        startNodes
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
 * Convenience function that takes nodes and returns a JSON string representation
 * @param nodes - Array of nodes in the flow
 * @returns A formatted JSON string representing the entire flow
 */
export const serializeNodes = (nodes: Node[]): string => {
    const serializedFlow = serializeFlow(nodes);
    return flowToJson(serializedFlow);
};

/**
 * Convenience function that takes a JSON string and returns the deserialized flow
 * @param jsonString - A JSON string representing a serialized flow
 * @returns Object containing trigger nodes, all nodes, and flow control methods
 */
export const deserializeNodes = (jsonString: string): DeserializedFlow => {
    const serializedFlow: SerializedFlow = JSON.parse(jsonString);
    return deserializeFlow(serializedFlow);
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
 * Checks if a node is a trigger node by looking for start/stop methods
 */
const isTriggerNode = (node: Node): boolean => {
    return typeof (node as any).start === 'function' && typeof (node as any).stop === 'function';
};

/**
 * Deserializes a flow from JSON format back to connected Node instances with flow control
 * @param serializedFlow - The serialized flow object
 * @returns Object containing trigger nodes, all nodes, and flow control methods
 */
export const deserializeFlow = (serializedFlow: SerializedFlow): DeserializedFlow => {
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

    // Get all trigger nodes
    const triggerNodes = serializedFlow.startNodes.map(triggerNodeName => {
        const triggerNode = nodeMap.get(triggerNodeName);
        if (!triggerNode) {
            throw new Error(`Trigger node not found: ${triggerNodeName}`);
        }
        return triggerNode;
    });

    return {
        triggerNodes,
        allNodes: nodeMap,
        getNode: (name: string) => nodeMap.get(name),

        startFlow: () => {
            triggerNodes.forEach(node => {
                if (typeof (node as any).start === 'function') {
                    (node as any).start();
                }
            });
        },

        stopFlow: () => {
            console.log("Stopping trigger:", triggerNodes.map(n => n.name).join(", "));
            triggerNodes.forEach(node => {
                if (typeof (node as any).stop === 'function') {
                    (node as any).stop();
                }
            });
        },

        startTrigger: (nodeName: string) => {
            const node = nodeMap.get(nodeName);
            if (node && typeof (node as any).start === 'function') {
                (node as any).start();
            }
        },

        stopTrigger: (nodeName: string) => {
            const node = nodeMap.get(nodeName);
            if (node && typeof (node as any).stop === 'function') {
                (node as any).stop();
            }
        }
    };
};
