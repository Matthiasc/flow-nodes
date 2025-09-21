import { describe, it, expect } from 'vitest';
import { serializeFlow, deserializeFlow, flowFromJson, nodeToFlowJson } from './serialize-flow.ts';
import { createDelayNode } from '../nodes/flow/create-delay-node.ts';
import { createDebuggerNode } from '../nodes/create-debugger-node.ts';
import { createRateLimitingNode } from '../nodes/flow/create-rate-limiting-node.ts';
import { createBatchNode } from '../nodes/flow/create-batch-node.ts';

describe('serialize-flow deserialization', () => {
    describe('deserializeFlow', () => {
        it('should deserialize a single node', () => {
            const originalNode = createDelayNode("test-delay", { delay: 500 });
            const serialized = serializeFlow(originalNode);

            const deserializedNode = deserializeFlow(serialized);

            expect(deserializedNode.name).toBe("test-delay");
            expect(deserializedNode.type).toBe("delayNode");
            expect(deserializedNode.properties.delay).toBe(500);
            expect(deserializedNode.children()).toHaveLength(0);
        });

        it('should deserialize a linear chain of nodes', () => {
            const delayNode = createDelayNode("delay", { delay: 1000 });
            const debugNode = createDebuggerNode("debug");
            delayNode.to(debugNode);

            const serialized = serializeFlow(delayNode);
            const deserializedNode = deserializeFlow(serialized);

            expect(deserializedNode.name).toBe("delay");
            expect(deserializedNode.type).toBe("delayNode");
            expect(deserializedNode.properties.delay).toBe(1000);

            const children = deserializedNode.children();
            expect(children).toHaveLength(1);
            expect(children[0].name).toBe("debug");
            expect(children[0].type).toBe("debuggerNode");
        });

        it('should deserialize branching flows', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 5, interval: 2000 });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const debugNode1 = createDebuggerNode("debug1");
            const debugNode2 = createDebuggerNode("debug2");

            rateLimitNode.to(delayNode);
            delayNode.to([debugNode1, debugNode2]);

            const serialized = serializeFlow(rateLimitNode);
            const deserializedNode = deserializeFlow(serialized);

            expect(deserializedNode.name).toBe("rate-limit");
            expect(deserializedNode.type).toBe("rateLimitingNode");

            // Navigate through the flow
            const delayChild = deserializedNode.children()[0];
            expect(delayChild.name).toBe("delay");
            expect(delayChild.properties.delay).toBe(500);

            const debugChildren = delayChild.children();
            expect(debugChildren).toHaveLength(2);
            expect(debugChildren.map((n: any) => n.name).sort()).toEqual(["debug1", "debug2"]);
        });

        it('should preserve node properties correctly', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", {
                limit: 10,
                interval: 5000
            });
            const batchNode = createBatchNode("batch", { numberOfMessages: 7 });
            rateLimitNode.to(batchNode);

            const serialized = serializeFlow(rateLimitNode);
            const deserializedNode = deserializeFlow(serialized);

            expect(deserializedNode.properties).toEqual({ limit: 10, interval: 5000 });

            const batchChild = deserializedNode.children()[0];
            expect(batchChild.properties).toEqual({ numberOfMessages: 7 });
        });

        it('should handle circular flows', () => {
            const node1 = createDebuggerNode("node1");
            const node2 = createDebuggerNode("node2");
            const node3 = createDebuggerNode("node3");

            node1.to(node2);
            node2.to(node3);
            node3.to(node1); // Creates a cycle

            const serialized = serializeFlow(node1);
            const deserializedNode = deserializeFlow(serialized);

            expect(deserializedNode.name).toBe("node1");

            // Follow the circular path
            const node2Recreated = deserializedNode.children()[0];
            expect(node2Recreated.name).toBe("node2");

            const node3Recreated = node2Recreated.children()[0];
            expect(node3Recreated.name).toBe("node3");

            const backToNode1 = node3Recreated.children()[0];
            expect(backToNode1.name).toBe("node1");
        });

        it('should throw error for unknown node types', () => {
            const serialized = {
                nodes: [{
                    id: "test",
                    name: "test",
                    type: "unknownNodeType",
                    properties: {},
                    connections: []
                }],
                startNode: "test"
            };

            expect(() => deserializeFlow(serialized)).toThrow("Unknown node type: unknownNodeType");
        });

        it('should throw error for missing start node', () => {
            const serialized = {
                nodes: [{
                    id: "test",
                    name: "test",
                    type: "debuggerNode",
                    properties: {},
                    connections: []
                }],
                startNode: "missingNode"
            };

            expect(() => deserializeFlow(serialized)).toThrow("Start node not found: missingNode");
        });

        it('should throw error for missing connection target', () => {
            const serialized = {
                nodes: [{
                    id: "test",
                    name: "test",
                    type: "debuggerNode",
                    properties: {},
                    connections: ["missingTarget"]
                }],
                startNode: "test"
            };

            expect(() => deserializeFlow(serialized)).toThrow("Target node not found: missingTarget");
        });
    });

    describe('flowFromJson', () => {
        it('should deserialize from JSON string', () => {
            const delayNode = createDelayNode("test-delay", { delay: 750 });
            const debugNode = createDebuggerNode("test-debug");
            delayNode.to(debugNode);

            const jsonString = nodeToFlowJson(delayNode);
            const deserializedNode = flowFromJson(jsonString);

            expect(deserializedNode.name).toBe("test-delay");
            expect(deserializedNode.properties.delay).toBe(750);

            const children = deserializedNode.children();
            expect(children).toHaveLength(1);
            expect(children[0].name).toBe("test-debug");
        });

        it('should handle invalid JSON', () => {
            expect(() => flowFromJson("invalid json")).toThrow();
        });
    });

    describe('round-trip serialization', () => {
        it('should maintain flow structure after serialize -> deserialize', () => {
            // Create a complex flow
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 5, interval: 1000 });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const batchNode = createBatchNode("batch", { numberOfMessages: 3 });
            const debugNode = createDebuggerNode("debug");

            rateLimitNode.to(delayNode);
            delayNode.to(batchNode);
            batchNode.to(debugNode);

            // Serialize and deserialize
            const serialized = serializeFlow(rateLimitNode);
            const deserialized = deserializeFlow(serialized);

            // Verify structure is maintained
            expect(deserialized.name).toBe("rate-limit");
            expect(deserialized.properties).toEqual({ limit: 5, interval: 1000 });

            const child1 = deserialized.children()[0];
            expect(child1.name).toBe("delay");
            expect(child1.properties.delay).toBe(500);

            const child2 = child1.children()[0];
            expect(child2.name).toBe("batch");
            expect(child2.properties.numberOfMessages).toBe(3);

            const child3 = child2.children()[0];
            expect(child3.name).toBe("debug");
            expect(child3.properties).toEqual({});
        });
    });
});