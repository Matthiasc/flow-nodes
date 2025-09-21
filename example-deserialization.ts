/**
 * Example demonstrating serialization and deserialization of flow nodes
 */

import {
    createDelayNode,
    createDebuggerNode,
    createRateLimitingNode,
    serializeFlow,
    deserializeFlow,
    nodeToFlowJson,
    flowFromJson
} from './src/index.ts';

// Create a flow
const rateLimitNode = createRateLimitingNode("rate-limiter", { limit: 5, interval: 1000 });
const delayNode = createDelayNode("delay", { delay: 500 });
const debugNode = createDebuggerNode("debug");

// Connect them
rateLimitNode.to(delayNode).to(debugNode);

// Serialize to JSON
const jsonString = nodeToFlowJson(rateLimitNode);
console.log("Serialized flow:");
console.log(jsonString);

// Deserialize back to nodes
const recreatedFlow = flowFromJson(jsonString);
console.log("\nRecreated flow starting node:", recreatedFlow.name);
console.log("Properties:", recreatedFlow.properties);

// Verify the connections
const children = recreatedFlow.children();
console.log("First child:", children[0].name, children[0].properties);

const grandchildren = children[0].children();
console.log("Grandchild:", grandchildren[0].name, grandchildren[0].properties);

// You can also use the individual functions:
const serializedFlow = serializeFlow(rateLimitNode);
const deserializedNode = deserializeFlow(serializedFlow);
console.log("\nUsing individual functions - same result:", deserializedNode.name);