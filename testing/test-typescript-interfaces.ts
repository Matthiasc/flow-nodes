import { createCronNode, createWatchFileNode, createDebuggerNode } from "../src/index.js";

// Test the new TypeScript interfaces
const cronNode = createCronNode("test-cron", { cronTime: "* * * * * *" });
const watchNode = createWatchFileNode("test-watch", { filePath: "./test.txt" });
const debugNode = createDebuggerNode("test-debug");

// TypeScript should now know these are TriggerNodes with start/stop/isRunning
console.log("Cron node has start method:", typeof cronNode.start === 'function');
console.log("Cron node has stop method:", typeof cronNode.stop === 'function');
console.log("Cron node has isRunning method:", typeof cronNode.isRunning === 'function');

console.log("Watch node has start method:", typeof watchNode.start === 'function');
console.log("Watch node has stop method:", typeof watchNode.stop === 'function');
console.log("Watch node has isRunning method:", typeof watchNode.isRunning === 'function');

// Debug node should be BaseNode - no start/stop/isRunning
console.log("Debug node has start method:", typeof (debugNode as any).start === 'function');
console.log("Debug node has stop method:", typeof (debugNode as any).stop === 'function');
console.log("Debug node has isRunning method:", typeof (debugNode as any).isRunning === 'function');

// Test the interface consistency
console.log("\n=== Interface Consistency Test ===");
console.log("Cron isRunning before start:", cronNode.isRunning());
console.log("Watch isRunning before start:", watchNode.isRunning());

cronNode.start();
watchNode.start();

console.log("Cron isRunning after start:", cronNode.isRunning());
console.log("Watch isRunning after start:", watchNode.isRunning());

cronNode.stop();
watchNode.stop();

console.log("Cron isRunning after stop:", cronNode.isRunning());
console.log("Watch isRunning after stop:", watchNode.isRunning());