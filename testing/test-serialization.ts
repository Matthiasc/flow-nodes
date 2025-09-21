import { createDelayNode } from "../src/nodes/flow/create-delay-node.js";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.js";
import { createRateLimitingNode } from "../src/nodes/flow/create-rate-limiting-node.js";
import { serializeNodes, serializeFlow, deserializeNodes } from "../src/lib/serialize-flow.js";

// Create a simple flow for testing
const delayNode = createDelayNode("delay-1", { delay: 500 });
const debugNode = createDebuggerNode("debug-1");
const rateLimitNode = createRateLimitingNode("rate-limit-1", { limit: 5, interval: 2000 });

// Connect them: rateLimitNode -> delayNode -> debugNode
rateLimitNode.to(delayNode).to(debugNode);

// Test the serialization
console.log("=== Flow Serialization Example ===");
console.log("\nFlow structure:");
console.log("rateLimitNode (limit: 5, interval: 2000) -> delayNode (delay: 500) -> debugNode");

console.log("\nSerialized flow as JSON:");
const flowJson = serializeNodes([rateLimitNode]);
console.log(flowJson);

console.log("\nSerialized flow object:");
const flowObject = serializeFlow([rateLimitNode]);
console.log(JSON.stringify(flowObject, null, 2));

// Test deserialization
console.log("\n=== Deserialization Example ===");
const { triggerNodes, allNodes, getNode, startFlow, stopFlow } = deserializeNodes(flowJson);
console.log("Trigger nodes:", triggerNodes.map(n => n.name));
console.log("All nodes:", Array.from(allNodes.keys()));

// Demonstrate that we can get the flow starting from any node
console.log("\n=== Starting from middle node (delayNode) ===");
const partialFlow = serializeNodes([delayNode]);
console.log(partialFlow);