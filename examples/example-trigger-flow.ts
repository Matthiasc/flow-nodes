import { createCronNode } from "../src/nodes/create-cron-node.js";
import { createWatchFileNode } from "../src/nodes/storage/create-watch-file-node.js";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.js";
import { createDelayNode } from "../src/nodes/flow/create-delay-node.js";
import { serializeNodes, deserializeNodes } from "../src/lib/serialize-flow.js";

async function main() {
    // Create a flow with multiple trigger nodes (all start stopped)
    const cronNode = createCronNode("cron-trigger", { cronTime: "* * * * * *" }); // Every second
    const fileWatchNode = createWatchFileNode("file-watcher", { filePath: "./test.txt" });
    const debugNode1 = createDebuggerNode("debug-1");
    const debugNode2 = createDebuggerNode("debug-2");
    const delayNode = createDelayNode("delay-1", { delay: 1000 });

    // Create two separate flows that converge
    cronNode.to(debugNode1).to(delayNode);
    fileWatchNode.to(debugNode2).to(delayNode);

    console.log("=== Multi-Trigger Flow Example ===");
    console.log("Flow structure:");
    console.log("cronNode -> debugNode1 -> delayNode");
    console.log("fileWatchNode -> debugNode2 -> delayNode");

    // Serialize the entire flow starting from both trigger nodes
    const flowJson = serializeNodes([cronNode, fileWatchNode]);
    console.log("\nSerialized flow:");
    console.log(flowJson);

    // Deserialize and analyze
    const { triggerNodes, allNodes, getNode, startFlow, stopFlow, startTrigger, stopTrigger } = deserializeNodes(flowJson);

    console.log("\n=== Flow Analysis ===");
    console.log("Trigger nodes found:", triggerNodes.map(n => `${n.name} (${n.type})`));
    console.log("All nodes:", Array.from(allNodes.keys()));

    // Demonstrate individual trigger control
    console.log("\n=== Individual Trigger Control ===");
    console.log("Starting only the cron trigger...");
    startTrigger("cron-trigger");

    console.log("Stopping only the file watcher...");
    stopTrigger("file-watcher");

    console.log("Starting all triggers...");
    startFlow();

    // Let the flow run for a few seconds to see it working
    console.log("Flow is running... (triggers active)");
    await new Promise(resolve => setTimeout(resolve, 4000));

    console.log("Stopping all triggers...");
    stopFlow();

    // No need to stop original nodes since they never auto-started
    console.log("\n=== Clean Shutdown ===");
    console.log("All triggers stopped cleanly!");

    // Show properties of trigger nodes
    console.log("\n=== Trigger Node Properties ===");
    triggerNodes.forEach(node => {
        console.log(`${node.name} (${node.type}):`, node.properties);
    });

}

// Run the example
main().catch(console.error);