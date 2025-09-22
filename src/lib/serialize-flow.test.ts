import { describe, it, expect } from 'vitest';
import { serializeFlow, flowToJson, serializeNodes } from './serialize-flow.ts';
import { createDelayNode } from '../nodes/flow/create-delay-node.ts';
import { createDebuggerNode } from '../nodes/create-debugger-node.ts';
import { createRateLimitingNode } from '../nodes/flow/create-rate-limiting-node.ts';
import { createPassThroughNode } from '../nodes/flow/create-passthrough-node.ts';
import { createBatchNode } from '../nodes/flow/create-batch-node.ts';

describe('serialize-flow', () => {
    describe('serializeFlow', () => {
        it('should serialize a single node', () => {
            const delayNode = createDelayNode("test-delay", { delay: 500 });

            const result = serializeFlow([delayNode]);

            expect(result).toEqual({
                nodes: [{
                    name: "test-delay",
                    type: 'delay',
                    properties: { delay: 500 },
                    connections: []
                }],
                startNodes: ["test-delay"]
            });
        });

        it('should serialize a linear chain of nodes', () => {
            const delayNode = createDelayNode("delay", { delay: 1000 });
            const debugNode = createDebuggerNode("debug");

            delayNode.to(debugNode);

            const result = serializeFlow([delayNode]);

            expect(result.nodes).toHaveLength(2);
            expect(result.startNodes).toEqual(["delay"]);

            const delayNodeSerialized = result.nodes.find(n => n.name === "delay");
            const debugNodeSerialized = result.nodes.find(n => n.name === "debug");

            expect(delayNodeSerialized).toEqual({
                name: "delay",
                type: 'delay',
                properties: { delay: 1000 },
                connections: ["debug"]
            });

            expect(debugNodeSerialized).toEqual({
                name: "debug",
                type: "debugger",
                properties: {},
                connections: []
            });
        });

        it('should serialize branching flows (one-to-many)', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 5, interval: 2000 });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const debugNode1 = createDebuggerNode("debug1");
            const debugNode2 = createDebuggerNode("debug2");

            rateLimitNode.to(delayNode);
            delayNode.to([debugNode1, debugNode2]);

            const result = serializeFlow([rateLimitNode]);

            expect(result.nodes).toHaveLength(4);
            expect(result.startNodes).toEqual(["rate-limit"]);

            const delayNodeSerialized = result.nodes.find(n => n.name === "delay");
            expect(delayNodeSerialized?.connections).toEqual(["debug1", "debug2"]);
        });

        it('should serialize merging flows (many-to-one)', () => {
            const passThrough1 = createPassThroughNode("pass1");
            const passThrough2 = createPassThroughNode("pass2");
            const batchNode = createBatchNode("batch", { numberOfMessages: 3 });

            passThrough1.to(batchNode);
            passThrough2.to(batchNode);

            // Start from passThrough1 - should capture both paths
            const result = serializeFlow([passThrough1]);

            expect(result.nodes).toHaveLength(2); // pass1 and batch (pass2 not reachable from pass1)
            expect(result.startNodes).toEqual(["pass1"]);
        });

        it('should handle circular flows without infinite loops', () => {
            const node1 = createPassThroughNode("node1");
            const node2 = createPassThroughNode("node2");
            const node3 = createPassThroughNode("node3");

            // Create a cycle: node1 -> node2 -> node3 -> node1
            node1.to(node2);
            node2.to(node3);
            node3.to(node1);

            const result = serializeFlow([node1]);

            expect(result.nodes).toHaveLength(3);
            expect(result.startNodes).toEqual(["node1"]);

            // Verify the circular connections
            const node1Serialized = result.nodes.find(n => n.name === "node1");
            const node2Serialized = result.nodes.find(n => n.name === "node2");
            const node3Serialized = result.nodes.find(n => n.name === "node3");

            expect(node1Serialized?.connections).toEqual(["node2"]);
            expect(node2Serialized?.connections).toEqual(["node3"]);
            expect(node3Serialized?.connections).toEqual(["node1"]);
        });

        it('should preserve node properties correctly', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", {
                limit: 10,
                interval: 5000
            });
            const delayNode = createDelayNode("delay", { delay: 2000 });
            const batchNode = createBatchNode("batch", { numberOfMessages: 7 });

            rateLimitNode.to(delayNode).to(batchNode);

            const result = serializeFlow([rateLimitNode]);

            const rateLimitSerialized = result.nodes.find(n => n.name === "rate-limit");
            const delaySerialized = result.nodes.find(n => n.name === "delay");
            const batchSerialized = result.nodes.find(n => n.name === "batch");

            expect(rateLimitSerialized?.properties).toEqual({ limit: 10, interval: 5000 });
            expect(delaySerialized?.properties).toEqual({ delay: 2000 });
            expect(batchSerialized?.properties).toEqual({ numberOfMessages: 7 });
        });

        it('should handle nodes with empty properties', () => {
            const debugNode = createDebuggerNode("debug");
            const passThroughNode = createPassThroughNode("pass");

            debugNode.to(passThroughNode);

            const result = serializeFlow([debugNode]);

            expect(result.nodes).toHaveLength(2);

            const debugSerialized = result.nodes.find(n => n.name === "debug");
            const passThroughSerialized = result.nodes.find(n => n.name === "pass");

            expect(debugSerialized?.properties).toEqual({});
            expect(passThroughSerialized?.properties).toEqual({});
        });
    });

    describe('flowToJson', () => {
        it('should convert SerializedFlow to formatted JSON string', () => {
            const flow = {
                nodes: [{
                    name: "test",
                    type: "testNode",
                    properties: { prop: "value" },
                    connections: ["other"]
                }],
                startNodes: ["test"]
            };

            const result = flowToJson(flow);
            const parsed = JSON.parse(result);

            expect(parsed).toEqual(flow);
            expect(result).toContain('\n'); // Should be pretty-printed
            expect(result).toContain('  '); // Should have indentation
        });
    });

    describe('serializeNodes', () => {
        it('should serialize node and return JSON string in one call', () => {
            const delayNode = createDelayNode("test-delay", { delay: 750 });
            const debugNode = createDebuggerNode("test-debug");

            delayNode.to(debugNode);

            const result = serializeNodes([delayNode]);
            const parsed = JSON.parse(result);

            expect(parsed.nodes).toHaveLength(2);
            expect(parsed.startNodes).toEqual(["test-delay"]);
            expect(parsed.nodes[0].properties.delay).toBe(750);
            expect(result).toContain('\n'); // Should be pretty-printed
        });
    });

    describe('edge cases', () => {
        it('should handle starting from a node in the middle of a flow', () => {
            const node1 = createPassThroughNode("node1");
            const node2 = createDelayNode("node2", { delay: 100 });
            const node3 = createDebuggerNode("node3");

            node1.to(node2).to(node3);

            // Start serialization from the middle node
            const result = serializeFlow([node2]);

            expect(result.nodes).toHaveLength(2); // Only node2 and node3
            expect(result.startNodes).toEqual(["node2"]);
            expect(result.nodes.some(n => n.name === "node1")).toBe(false);
        });

        it('should handle disconnected subgraphs correctly', () => {
            const connectedNode1 = createPassThroughNode("connected1");
            const connectedNode2 = createPassThroughNode("connected2");
            const isolatedNode = createPassThroughNode("isolated");

            connectedNode1.to(connectedNode2);
            // isolatedNode is not connected to anything

            const result = serializeFlow([connectedNode1]);

            expect(result.nodes).toHaveLength(2);
            expect(result.nodes.every(n => n.name !== "isolated")).toBe(true);
        });
    });
});