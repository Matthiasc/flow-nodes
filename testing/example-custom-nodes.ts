/**
 * Example demonstrating custom node factories for external node types
 */

import { serializeNodes, deserializeNodes } from "../src/lib/serialize-flow.js";
import { createNode } from "../src/lib/create-node.js";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.js";

// ===== Custom Node Types (simulating external nodes) =====

// Custom calculator node
const createCalculatorNode = (name: string, properties?: { operation: string; value: number }) => {
    return createNode({
        type: "calculatorNode",
        name,
        properties: properties || { operation: "add", value: 0 },
        process: async ({ msg, log, globals }) => {
            const { operation, value } = properties || { operation: "add", value: 0 };
            const input = typeof msg.payload === 'number' ? msg.payload : 0;

            let result: number;
            switch (operation) {
                case 'add': result = input + value; break;
                case 'multiply': result = input * value; break;
                case 'subtract': result = input - value; break;
                default: result = input;
            }

            console.log(`Calculator ${operation}: ${input} ${operation} ${value} = ${result}`);
            return { ...msg, payload: result };
        }
    });
};

// Custom formatter node  
const createFormatterNode = (name: string, properties?: { format: string }) => {
    return createNode({
        type: "formatterNode",
        name,
        properties: properties || { format: "json" },
        process: async ({ msg, log, globals }) => {
            const { format } = properties || { format: "json" };

            let formatted: string;
            switch (format) {
                case 'json': formatted = JSON.stringify(msg.payload); break;
                case 'csv': formatted = `"${msg.payload}"`; break;
                case 'xml': formatted = `<value>${msg.payload}</value>`; break;
                default: formatted = String(msg.payload);
            }

            console.log(`Formatted as ${format}: ${formatted}`);
            return { ...msg, payload: formatted };
        }
    });
};

// ===== Example Usage =====

console.log("=== Custom Node Factories Example ===\n");

// 1. Create a flow with custom nodes
const calcNode = createCalculatorNode("calc", { operation: "multiply", value: 3 });
const formatNode = createFormatterNode("format", { format: "xml" });
const debugNode = createDebuggerNode("debug");

// Connect them: calc -> format -> debug
calcNode.to(formatNode).to(debugNode);

// 2. Serialize the flow (this works fine)
console.log("1. Serializing flow with custom nodes...");
const flowJson = serializeNodes([calcNode]);
console.log("✅ Serialization successful!\n");

// 3. Try to deserialize WITHOUT custom factories (will fail)
console.log("2. Attempting deserialization WITHOUT custom factories...");
try {
    deserializeNodes(flowJson);
    console.log("❌ This shouldn't work!");
} catch (error) {
    console.log(`✅ Expected error: ${(error as Error).message}\n`);
}

// 4. Deserialize WITH custom factories (will work)
console.log("3. Deserializing WITH custom factories...");
const customFactories = {
    calculatorNode: createCalculatorNode,
    formatterNode: createFormatterNode
};

try {
    const { triggerNodes, allNodes, getNode } = deserializeNodes(flowJson, customFactories);
    console.log("✅ Deserialization successful!");
    console.log(`   Trigger nodes: [${triggerNodes.map(n => n.name).join(", ")}]`);
    console.log(`   All nodes: [${Array.from(allNodes.keys()).join(", ")}]`);

    // Test the reconstructed flow
    console.log("\n4. Testing the reconstructed flow:");
    const reconstructedCalc = getNode("calc");
    if (reconstructedCalc) {
        // Simulate processing a message
        console.log("   Testing calculator with input: 7");
        console.log("   (Note: In real usage, flows process automatically when triggered)");
    }

} catch (error) {
    console.log(`❌ Unexpected error: ${(error as Error).message}`);
}

console.log("\n=== Key Benefits ===");
console.log("✅ Built-in nodes work without any extra setup");
console.log("✅ Custom nodes can be added via customFactories parameter");
console.log("✅ Custom factories override built-in ones if same type name");
console.log("✅ Clean separation between library and user code");