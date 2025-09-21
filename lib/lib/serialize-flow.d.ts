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
/**
 * Deserializes a flow from JSON format back to connected Node instances
 * @param serializedFlow - The serialized flow object
 * @returns The starting node of the recreated flow
 */
declare const deserializeFlow: (serializedFlow: SerializedFlow) => Node;
/**
 * Convenience function that takes a JSON string and returns the starting node of a recreated flow
 * @param jsonString - A JSON string representing a serialized flow
 * @returns The starting node of the recreated flow
 */
declare const flowFromJson: (jsonString: string) => Node;

export { type SerializedFlow, type SerializedNode, deserializeFlow, flowFromJson, flowToJson, nodeToFlowJson, serializeFlow };
