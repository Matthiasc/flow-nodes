/**
 * Example demonstrating serialization and deserialization of flow nodes
 */

import {
    createDelayNode,
    createDebuggerNode,
    createRateLimitingNode,
    serializeFlow,
    deserializeFlow,
    serializeNodes,
    deserializeNodes
} from '../src/index.js';

// Create a flow
const rateLimitNode = createRateLimitingNode("rate-limiter", { limit: 5, interval: 1000 });
const delayNode = createDelayNode("delay", { delay: 500 });
const debugNode = createDebuggerNode("debug");

// Connect them
rateLimitNode.to(delayNode).to(debugNode);

// Serialize to JSON
const jsonString = serializeNodes([rateLimitNode]);
console.log("Serialized flow:");
console.log(jsonString);

// Deserialize back to nodes
const { triggerNodes, allNodes, getNode, startFlow, stopFlow } = deserializeNodes(jsonString);
console.log("\nRecreated flow - trigger nodes:", triggerNodes.map(n => n.name));
console.log("All nodes:", Array.from(allNodes.keys()));

// Access nodes by name
const recreatedRateLimit = getNode("rate-limiter");
console.log("Rate limiter properties:", recreatedRateLimit?.properties);

// Verify the connections
const children = recreatedRateLimit?.children();
console.log("First child:", children?.[0]?.name, children?.[0]?.properties);

const grandchildren = children?.[0]?.children();
console.log("Grandchild:", grandchildren?.[0]?.name, grandchildren?.[0]?.properties);

// Flow control examples
console.log("\nFlow control:");
console.log("Starting entire flow...");
startFlow(); // Start all trigger nodes

console.log("Stopping entire flow...");
stopFlow(); // Stop all trigger nodes

// You can also use the individual functions:
const serializedFlow = serializeFlow([rateLimitNode]);
const deserializedFlow = deserializeFlow(serializedFlow);
console.log("\nUsing individual functions - trigger nodes:", deserializedFlow.triggerNodes.map(n => n.name));