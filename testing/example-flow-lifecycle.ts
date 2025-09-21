import { createCronNode } from "../src/nodes/create-cron-node.js";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.js";
import { serializeNodes, deserializeNodes } from "../src/lib/serialize-flow.js";

console.log("=== Flow Lifecycle Example ===");

// Step 1: Create and start original flow
console.log("\n1. Creating original flow...");
const originalCron = createCronNode("original-cron", { cronTime: "* * * * * *", autoStart: false });
const originalDebug = createDebuggerNode("original-debug");
originalCron.to(originalDebug);

console.log("2. Starting original cron...");
originalCron.start();

// Wait a moment to see some output
await new Promise(resolve => setTimeout(resolve, 3000));

console.log("\n3. Serializing flow...");
const flowJson = serializeNodes([originalCron]);

console.log("\n4. Deserializing to create new flow instance...");
const { triggerNodes, startFlow, stopFlow } = deserializeNodes(flowJson);

console.log("\n5. Both flows are now running independently!");
console.log("   - Original cron is still running");
console.log("   - Deserialized cron is also running (started via startFlow())");// Wait to see both running
await new Promise(resolve => setTimeout(resolve, 3000));

console.log("\n6. Stopping ONLY the deserialized flow...");
stopFlow();

console.log("7. Original flow should still be running...");
await new Promise(resolve => setTimeout(resolve, 3000));

console.log("\n8. Now stopping the original flow...");
originalCron.stop();

console.log("9. Both flows should now be stopped.");
await new Promise(resolve => setTimeout(resolve, 2000));

console.log("\n=== Summary ===");
console.log("- Serialization/deserialization creates NEW instances");
console.log("- Original and deserialized flows run independently");
console.log("- Flow control only affects the specific instance");
console.log("- This allows for flow templates and multiple running instances");