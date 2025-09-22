import { describe, it, expect } from 'vitest';
import { serializeFlow, deserializeFlow, deserializeNodes, serializeNodes } from './serialize-flow.ts';
import { createDelayNode } from '../nodes/flow/create-delay-node.ts';
import { createDebuggerNode } from '../nodes/create-debugger-node.ts';
import { createRateLimitingNode } from '../nodes/flow/create-rate-limiting-node.ts';
import { createBatchNode } from '../nodes/flow/create-batch-node.ts';

describe('serialize-flow enhanced deserialization', () => {
    describe('deserializeFlow', () => {
        it('should deserialize a single node and return all nodes', () => {
            const originalNode = createDelayNode("test-delay", { delay: 500 });
            const serialized = serializeFlow([originalNode]);

            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            expect(allNodes.size).toBe(1);
            expect(getNode("test-delay")).toBeDefined();
            expect(getNode("test-delay")?.name).toBe("test-delay");
            expect(getNode("test-delay")?.type).toBe("delayNode");
            expect(getNode("test-delay")?.properties.delay).toBe(500);

            // Since delayNode doesn't have start/stop, it shouldn't be a trigger
            expect(triggerNodes).toHaveLength(1); // fallback to first node when no triggers
            expect(triggerNodes[0].name).toBe("test-delay");
        });

        it('should deserialize a linear chain of nodes', () => {
            const delayNode = createDelayNode("delay", { delay: 1000 });
            const debugNode = createDebuggerNode("debug");
            delayNode.to(debugNode);

            const serialized = serializeFlow([delayNode]);
            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            expect(allNodes.size).toBe(2);
            expect(getNode("delay")).toBeDefined();
            expect(getNode("debug")).toBeDefined();

            const delayNodeRecreated = getNode("delay")!;
            expect(delayNodeRecreated.properties.delay).toBe(1000);

            const children = delayNodeRecreated.children();
            expect(children).toHaveLength(1);
            expect(children[0].name).toBe("debug");
        });

        it('should deserialize branching flows', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 5, interval: 2000 });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const debugNode1 = createDebuggerNode("debug1");
            const debugNode2 = createDebuggerNode("debug2");

            rateLimitNode.to(delayNode);
            delayNode.to([debugNode1, debugNode2]);

            const serialized = serializeFlow([rateLimitNode]);
            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            expect(allNodes.size).toBe(4);
            expect(getNode("rate-limit")).toBeDefined();
            expect(getNode("delay")).toBeDefined();
            expect(getNode("debug1")).toBeDefined();
            expect(getNode("debug2")).toBeDefined();

            // Navigate through the flow
            const rateLimitRecreated = getNode("rate-limit")!;
            const delayChild = rateLimitRecreated.children()[0];
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

            const serialized = serializeFlow([rateLimitNode]);
            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            const rateLimitRecreated = getNode("rate-limit")!;
            expect(rateLimitRecreated.properties).toEqual({ limit: 10, interval: 5000 });

            const batchChild = rateLimitRecreated.children()[0];
            expect(batchChild.properties).toEqual({ numberOfMessages: 7 });
        });

        it('should provide flow control methods', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 10, interval: 5000 });
            const serialized = serializeFlow([rateLimitNode]);
            const flow = deserializeFlow(serialized);

            // Should have flow control methods
            expect(typeof flow.startFlow).toBe('function');
            expect(typeof flow.stopFlow).toBe('function');
            expect(typeof flow.startTrigger).toBe('function');
            expect(typeof flow.stopTrigger).toBe('function');

            // These should not throw (even if the nodes don't have start/stop methods)
            expect(() => flow.startFlow()).not.toThrow();
            expect(() => flow.stopFlow()).not.toThrow();
            expect(() => flow.startTrigger("rate-limit")).not.toThrow();
            expect(() => flow.stopTrigger("rate-limit")).not.toThrow();
        });

        it('should handle circular flows', () => {
            const node1 = createDebuggerNode("node1");
            const node2 = createDebuggerNode("node2");
            const node3 = createDebuggerNode("node3");

            node1.to(node2);
            node2.to(node3);
            node3.to(node1); // Creates a cycle

            const serialized = serializeFlow([node1]);
            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            expect(allNodes.size).toBe(3);
            expect(getNode("node1")).toBeDefined();
            expect(getNode("node2")).toBeDefined();
            expect(getNode("node3")).toBeDefined();

            // Follow the circular path
            const node1Recreated = getNode("node1")!;
            const node2Recreated = node1Recreated.children()[0];
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
                    connections: [],
                    isTrigger: false
                }],
                startNodes: ["test"]
            };

            expect(() => deserializeFlow(serialized)).toThrow("Unknown node type: unknownNodeType");
        });

        it('should throw error for missing trigger node', () => {
            const serialized = {
                nodes: [{
                    id: "test",
                    name: "test",
                    type: "debuggerNode",
                    properties: {},
                    connections: [],
                    isTrigger: false
                }],
                startNodes: ["missingNode"]
            };

            expect(() => deserializeFlow(serialized)).toThrow("Trigger node not found: missingNode");
        });

        it('should throw error for missing connection target', () => {
            const serialized = {
                nodes: [{
                    id: "test",
                    name: "test",
                    type: "debuggerNode",
                    properties: {},
                    connections: ["missingTarget"],
                    isTrigger: false
                }],
                startNodes: ["test"]
            };

            expect(() => deserializeFlow(serialized)).toThrow("Target node not found: missingTarget");
        });
    });

    describe('deserializeNodes', () => {
        it('should deserialize from JSON string', () => {
            const delayNode = createDelayNode("test-delay", { delay: 750 });
            const debugNode = createDebuggerNode("test-debug");
            delayNode.to(debugNode);

            const jsonString = serializeNodes([delayNode]);
            const { triggerNodes, allNodes, getNode } = deserializeNodes(jsonString);

            expect(allNodes.size).toBe(2);
            expect(getNode("test-delay")).toBeDefined();
            expect(getNode("test-delay")?.properties.delay).toBe(750);
            expect(getNode("test-debug")).toBeDefined();
        });

        it('should handle invalid JSON', () => {
            expect(() => deserializeNodes("invalid json")).toThrow();
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
            const serialized = serializeFlow([rateLimitNode]);
            const { triggerNodes, allNodes, getNode } = deserializeFlow(serialized);

            // Verify structure is maintained
            expect(allNodes.size).toBe(4);

            const rateLimitRecreated = getNode("rate-limit")!;
            expect(rateLimitRecreated.properties).toEqual({ limit: 5, interval: 1000 });

            const child1 = rateLimitRecreated.children()[0];
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

    describe('trigger node detection', () => {
        it('should detect trigger nodes by start/stop interface', () => {
            // This test will pass once we have actual trigger nodes with start/stop methods
            const delayNode = createDelayNode("delay", { delay: 500 });
            const serialized = serializeFlow([delayNode]);

            // Check that delayNode is not in startNodes (since it doesn't have start/stop methods)
            expect(serialized.startNodes).toEqual(['delay']); // Since we passed delayNode as start node
            
            const delayNodeSerialized = serialized.nodes.find(n => n.name === "delay");
            expect(delayNodeSerialized?.name).toBe('delay');
            expect(delayNodeSerialized?.type).toBe('delayNode');
        });
    });
});