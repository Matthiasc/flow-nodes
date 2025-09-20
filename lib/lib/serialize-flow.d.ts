import { Node } from './create-node.js';
import './create-globals.js';
import './create-logger.js';

interface SerializedNode {
    id: string;
    name: string;
    type: string;
    properties: Record<string, any>;
    connections: string[];
}
interface SerializedFlow {
    nodes: SerializedNode[];
    startNode: string;
}
/**
 * Serializes a flow graph to JSON starting from a given node
 * @param startNode - The starting node of the flow
 * @returns A JSON representation of the entire flow graph
 */
declare const serializeFlow: (startNode: Node) => SerializedFlow;
/**
 * Converts a serialized flow to a pretty-printed JSON string
 * @param flow - The serialized flow object
 * @returns A formatted JSON string
 */
declare const flowToJson: (flow: SerializedFlow) => string;
/**
 * Convenience function that takes a starting node and returns a JSON string representation
 * @param startNode - The starting node of the flow
 * @returns A formatted JSON string representing the entire flow
 */
declare const nodeToFlowJson: (startNode: Node) => string;

export { type SerializedFlow, type SerializedNode, flowToJson, nodeToFlowJson, serializeFlow };
