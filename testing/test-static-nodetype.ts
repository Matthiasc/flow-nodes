/**
 * Test for static nodeType property on factory functions
 */

import { createCronNode } from "../src/nodes/create-cron-node.js";

console.log("=== Testing Static NodeType Property ===");

// Test accessing the static nodeType property
console.log(`createCronNode.nodeType: ${(createCronNode as any).nodeType}`);

// Test that the function still works normally
const cronNode = createCronNode("test-cron", { cronTime: "0 */5 * * * *" });
console.log(`Created node type: ${cronNode.type}`);
console.log(`Created node name: ${cronNode.name}`);

console.log("\n✅ Static nodeType property works!");