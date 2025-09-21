import {
    type NodeFactory,
    type TriggerNodeFactory,
    createCronNode,
    createDebuggerNode
} from "../src/index.js";

// ✨ BEFORE: Confusing boolean flag
// const createCronNode: NodeFactory<CronNodeProps, true> = ...  😕

// ✨ AFTER: Crystal clear intent
// const createCronNode: TriggerNodeFactory<CronNodeProps> = ...  😍

console.log("=== TypeScript Clarity Improvement ===");

// Now it's immediately obvious which nodes are triggers:
const cronNode = createCronNode("cron", { cronTime: "0 */5 * * * *" });
const debugNode = createDebuggerNode("debug");

// TypeScript knows exactly what methods are available:
console.log("✅ Cron node (TriggerNodeFactory):");
console.log("  - Has start():", typeof cronNode.start === 'function');
console.log("  - Has stop():", typeof cronNode.stop === 'function');
console.log("  - Has isRunning():", typeof cronNode.isRunning === 'function');

console.log("\n✅ Debug node (NodeFactory):");
console.log("  - Has start():", typeof (debugNode as any).start === 'function');
console.log("  - Has stop():", typeof (debugNode as any).stop === 'function');
console.log("  - Has isRunning():", typeof (debugNode as any).isRunning === 'function');

console.log("\n🎯 Type signatures are now explicit and clear!");
console.log("🎯 No more confusing boolean flags!");
console.log("🎯 IntelliSense immediately shows available methods!");