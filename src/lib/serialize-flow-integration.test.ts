import { describe, it, expect } from 'vitest';
import {
    serializeFlow,
    deserializeFlow,
    serializeNodes,
    deserializeNodes
} from './serialize-flow';
import { createDelayNode } from '../nodes/flow/create-delay-node';
import { createDebuggerNode } from '../nodes/create-debugger-node';
import { createRateLimitingNode } from '../nodes/flow/create-rate-limiting-node';

describe('Serialization Integration Tests', () => {
    describe('Basic Flow Serialization', () => {
        it('should serialize a complete flow with multiple node types', () => {
            // Create a realistic flow: rateLimitNode -> delayNode -> debugNode
            const rateLimitNode = createRateLimitingNode("rate-limit-1", { limit: 5, interval: 2000 });
            const delayNode = createDelayNode("delay-1", { delay: 500 });
            const debugNode = createDebuggerNode("debug-1");

            // Connect them
            rateLimitNode.to(delayNode).to(debugNode);

            // Test serializeNodes (JSON string output)
            const flowJsonString = serializeNodes([rateLimitNode]);
            const parsedJson = JSON.parse(flowJsonString);

            expect(parsedJson.nodes).toHaveLength(3);
            expect(parsedJson.startNodes).toEqual(['rate-limit-1']);

            // Verify each node in the serialization
            const rateLimitSerialized = parsedJson.nodes.find((n: any) => n.name === 'rate-limit-1');
            expect(rateLimitSerialized.type).toBe('rateLimitingNode');
            expect(rateLimitSerialized.properties).toEqual({ limit: 5, interval: 2000 });
            expect(rateLimitSerialized.connections).toEqual(['delay-1']);

            const delaySerialized = parsedJson.nodes.find((n: any) => n.name === 'delay-1');
            expect(delaySerialized.type).toBe('delayNode');
            expect(delaySerialized.properties).toEqual({ delay: 500 });
            expect(delaySerialized.connections).toEqual(['debug-1']);

            const debugSerialized = parsedJson.nodes.find((n: any) => n.name === 'debug-1');
            expect(debugSerialized.type).toBe('debuggerNode');
            expect(debugSerialized.connections).toEqual([]);
        });

        it('should serialize partial flow starting from middle node', () => {
            const rateLimitNode = createRateLimitingNode("rate-limit", { limit: 3, interval: 1000 });
            const delayNode = createDelayNode("delay", { delay: 200 });
            const debugNode = createDebuggerNode("debug");

            rateLimitNode.to(delayNode).to(debugNode);

            // Serialize starting from the middle node (delayNode)
            const partialFlowJson = serializeNodes([delayNode]);
            const parsed = JSON.parse(partialFlowJson);

            // Should only include delayNode and debugNode, not rateLimitNode
            expect(parsed.nodes).toHaveLength(2);
            expect(parsed.startNodes).toEqual(['delay']);
            expect(parsed.nodes.find((n: any) => n.name === 'delay')).toBeDefined();
            expect(parsed.nodes.find((n: any) => n.name === 'debug')).toBeDefined();
            expect(parsed.nodes.find((n: any) => n.name === 'rate-limit')).toBeUndefined();
        });

        it('should serialize and deserialize flow maintaining structure', () => {
            const rateLimitNode = createRateLimitingNode("rate-limiter", { limit: 10, interval: 5000 });
            const delayNode = createDelayNode("delay", { delay: 1000 });
            const debugNode = createDebuggerNode("debug");

            rateLimitNode.to(delayNode).to(debugNode);

            // Serialize using serializeFlow (object output)
            const flowObject = serializeFlow([rateLimitNode]);

            // Deserialize using deserializeFlow
            const { triggerNodes, allNodes, getNode, startFlow, stopFlow } = deserializeFlow(flowObject);

            expect(triggerNodes).toHaveLength(1);
            expect(triggerNodes[0].name).toBe('rate-limiter');
            expect(allNodes.size).toBe(3);
            expect(Array.from(allNodes.keys())).toEqual(['rate-limiter', 'delay', 'debug']);

            // Test node retrieval
            const recreatedRateLimit = getNode('rate-limiter');
            expect(recreatedRateLimit?.properties).toEqual({ limit: 10, interval: 5000 });

            // Test connections are maintained
            const delayNodeRecreated = getNode('delay');
            expect(delayNodeRecreated?.properties).toEqual({ delay: 1000 });

            // Verify the flow structure
            const rateLimitChildren = recreatedRateLimit?.children();
            expect(rateLimitChildren).toHaveLength(1);
            expect(rateLimitChildren?.[0].name).toBe('delay');

            const delayChildren = rateLimitChildren?.[0].children();
            expect(delayChildren).toHaveLength(1);
            expect(delayChildren?.[0].name).toBe('debug');

            // Test flow control functions exist
            expect(typeof startFlow).toBe('function');
            expect(typeof stopFlow).toBe('function');
        });
    });

    describe('JSON String vs Object Serialization', () => {
        it('should work with both serializeNodes (JSON string) and serializeFlow (object)', () => {
            const delayNode = createDelayNode("test-delay", { delay: 100 });
            const debugNode = createDebuggerNode("test-debug");
            delayNode.to(debugNode);

            // Test JSON string approach
            const jsonString = serializeNodes([delayNode]);
            const fromJsonString = deserializeNodes(jsonString);

            // Test object approach
            const flowObject = serializeFlow([delayNode]);
            const fromObject = deserializeFlow(flowObject);

            // Both should produce identical results
            expect(fromJsonString.allNodes.size).toBe(fromObject.allNodes.size);
            expect(fromJsonString.triggerNodes.length).toBe(fromObject.triggerNodes.length);

            // Verify content is the same
            const nodeFromJson = fromJsonString.getNode('test-delay');
            const nodeFromObject = fromObject.getNode('test-delay');

            expect(nodeFromJson?.name).toBe(nodeFromObject?.name);
            expect(nodeFromJson?.type).toBe(nodeFromObject?.type);
            expect(nodeFromJson?.properties).toEqual(nodeFromObject?.properties);
        });

        it('should handle round-trip JSON string serialization', () => {
            const rateLimitNode = createRateLimitingNode("rate", { limit: 5, interval: 1000 });
            const delayNode = createDelayNode("delay", { delay: 500 });
            rateLimitNode.to(delayNode);

            // Original -> JSON string -> back to nodes -> JSON string again
            const originalJson = serializeNodes([rateLimitNode]);
            const recreated = deserializeNodes(originalJson);

            // Serialize the recreated flow
            const recreatedNodes = Array.from(recreated.allNodes.values());
            const secondJson = serializeNodes(recreatedNodes);

            // Should be equivalent (though order might differ)
            const original = JSON.parse(originalJson);
            const second = JSON.parse(secondJson);

            expect(second.nodes).toHaveLength(original.nodes.length);
            expect(second.startNodes).toEqual(original.startNodes);

            // Verify each node is preserved
            original.nodes.forEach((originalNode: any) => {
                const matchingNode = second.nodes.find((n: any) => n.name === originalNode.name);
                expect(matchingNode).toBeDefined();
                expect(matchingNode.type).toBe(originalNode.type);
                expect(matchingNode.properties).toEqual(originalNode.properties);
                expect(matchingNode.connections).toEqual(originalNode.connections);
            });
        });
    });

    describe('Complex Flow Patterns', () => {
        it('should handle linear chain of multiple nodes', () => {
            // Create a longer chain: rate -> delay1 -> debug1 -> delay2 -> debug2
            const rateNode = createRateLimitingNode("rate", { limit: 3, interval: 1500 });
            const delay1 = createDelayNode("delay1", { delay: 100 });
            const debug1 = createDebuggerNode("debug1");
            const delay2 = createDelayNode("delay2", { delay: 200 });
            const debug2 = createDebuggerNode("debug2");

            rateNode.to(delay1).to(debug1).to(delay2).to(debug2);

            const serialized = serializeFlow([rateNode]);
            const deserialized = deserializeFlow(serialized);

            expect(deserialized.allNodes.size).toBe(5);
            expect(deserialized.triggerNodes).toHaveLength(1);

            // Verify the entire chain is connected
            const rate = deserialized.getNode('rate');
            const chain = [];
            let current = rate;
            while (current) {
                chain.push(current.name);
                const children = current.children();
                current = children.length > 0 ? children[0] : null;
            }

            expect(chain).toEqual(['rate', 'delay1', 'debug1', 'delay2', 'debug2']);
        });

        it('should handle flow starting from non-trigger node', () => {
            const delayNode = createDelayNode("standalone-delay", { delay: 300 });
            const debugNode = createDebuggerNode("standalone-debug");
            delayNode.to(debugNode);

            const serialized = serializeFlow([delayNode]);
            const deserialized = deserializeFlow(serialized);

            // Non-trigger nodes become start nodes when they have no parents
            expect(deserialized.allNodes.size).toBe(2);
            expect(deserialized.triggerNodes).toHaveLength(1); // delay becomes start node
            expect(serialized.startNodes).toEqual(['standalone-delay']);

            const recreatedDelay = deserialized.getNode('standalone-delay');
            expect(recreatedDelay?.properties.delay).toBe(300);
            expect(recreatedDelay?.children()).toHaveLength(1);
            expect(recreatedDelay?.children()[0].name).toBe('standalone-debug');
        });
    });
});