import { createCronNode } from "../src/nodes/create-cron-node.js";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.js";
import { serializeNodes, deserializeNodes } from "../src/lib/serialize-flow.js";

console.log("=== Clean Flow Management Example ===");

// Best Practice: Create flows with autoStart: false for better control
const cronNode = createCronNode("managed-cron", { cronTime: "* * * * * *" });
const debugNode = createDebuggerNode("managed-debug");
cronNode.to(debugNode);

console.log("\n1. Flow created but not started yet");

// Serialize the flow template
const flowTemplate = serializeNodes([cronNode]);
console.log("\n2. Flow template serialized");

// Create a managed instance from the template
const flowInstance = deserializeNodes(flowTemplate);
console.log("\n3. Flow instance created from template");

console.log("\n4. Starting the flow instance...");
flowInstance.startFlow();

// Let it run for a few seconds
await new Promise(resolve => setTimeout(resolve, 4000));

console.log("\n5. Stopping the flow instance...");
flowInstance.stopFlow();

console.log("\n6. Flow cleanly stopped!");

console.log("\n=== Key Benefits ===");
console.log("- Set autoStart: false for better control");
console.log("- Use the deserialized flow's control methods");
console.log("- Clean startup and shutdown");
console.log("- Multiple instances can be created from the same template");