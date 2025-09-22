import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createCronNode } from '../nodes/create-cron-node';
import { createWatchFileNode } from '../nodes/storage/create-watch-file-node';
import { createDebuggerNode } from '../nodes/create-debugger-node';
import { createDelayNode } from '../nodes/flow/create-delay-node';
import { serializeNodes, deserializeNodes } from '../lib/serialize-flow';

describe('Trigger Flow Integration Tests', () => {
    let originalConsoleLog: typeof console.log;
    let logMessages: string[];

    beforeEach(() => {
        // Capture console.log output for testing
        logMessages = [];
        originalConsoleLog = console.log;
        console.log = (...args) => {
            logMessages.push(args.join(' '));
            originalConsoleLog(...args);
        };
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    describe('Multi-Trigger Flow Management', () => {
        it('should handle multiple trigger nodes in one flow', async () => {
            // Create a flow with multiple trigger nodes
            const cronNode = createCronNode("cron-trigger", { cronTime: "* * * * * *" }); // Every second
            const debugNode1 = createDebuggerNode("debug-1");
            const debugNode2 = createDebuggerNode("debug-2");
            const delayNode = createDelayNode("delay-1", { delay: 100 });

            // Create converging flows: both triggers -> separate debugs -> same delay
            cronNode.to(debugNode1);
            debugNode1.to(delayNode);
            // For testing, we'll simulate file watch without actual file dependency
            const mockFileWatchNode = createDebuggerNode("file-watcher"); // Use debug node as mock trigger
            mockFileWatchNode.to(debugNode2);
            debugNode2.to(delayNode);

            // Serialize the entire flow - pass both nodes to start from both
            const flowJson = serializeNodes([cronNode, mockFileWatchNode]);
            const parsed = JSON.parse(flowJson);

            // Should detect start nodes from trigger nodes only
            expect(parsed.startNodes).toEqual(['cron-trigger']); // Only cron is a trigger node
            expect(parsed.nodes).toHaveLength(5); // cron-trigger, file-watcher, debug-1, debug-2, delay-1

            // Deserialize and test flow control
            const { triggerNodes, allNodes, getNode, startFlow, stopFlow, startTrigger, stopTrigger } = deserializeNodes(flowJson);

            expect(triggerNodes).toHaveLength(1); // Only real trigger (cron)
            expect(allNodes.size).toBe(5); // cron-trigger, file-watcher, debug-1, debug-2, delay-1
            expect(Array.from(allNodes.keys())).toContain('cron-trigger');
            expect(Array.from(allNodes.keys())).toContain('file-watcher');
            expect(Array.from(allNodes.keys())).toContain('delay-1');

            // Test flow control functions
            expect(typeof startFlow).toBe('function');
            expect(typeof stopFlow).toBe('function');
            expect(typeof startTrigger).toBe('function');
            expect(typeof stopTrigger).toBe('function');
        });

        it('should manage individual trigger control', () => {
            const cronNode = createCronNode("cron-1", { cronTime: "0 */5 * * * *" });
            const debugNode = createDebuggerNode("debug");
            cronNode.to(debugNode);

            const serialized = serializeNodes([cronNode]);
            const { triggerNodes, startTrigger, stopTrigger } = deserializeNodes(serialized);

            expect(triggerNodes).toHaveLength(1);
            const trigger = triggerNodes[0];

            // Test individual trigger control
            expect(trigger.isRunning()).toBe(false);

            // Start individual trigger by name
            startTrigger("cron-1");
            expect(trigger.isRunning()).toBe(true);

            // Stop individual trigger by name  
            stopTrigger("cron-1");
            expect(trigger.isRunning()).toBe(false);
        });

        it('should handle flow with no triggers (manual start nodes)', () => {
            // Create a flow with no trigger nodes
            const delayNode = createDelayNode("manual-start", { delay: 100 });
            const debugNode = createDebuggerNode("manual-debug");
            delayNode.to(debugNode);

            const serialized = serializeNodes([delayNode]);
            const { triggerNodes, allNodes, startFlow, stopFlow } = deserializeNodes(serialized);

            // No actual trigger nodes, but delay becomes start node
            expect(triggerNodes).toHaveLength(1); // delayNode becomes start trigger
            expect(allNodes.size).toBe(2);

            // Flow control should still work (just no-op for triggers)
            expect(() => startFlow()).not.toThrow();
            expect(() => stopFlow()).not.toThrow();
        });
    });

    describe('Trigger Node Properties and Behavior', () => {
        it('should preserve trigger node properties through serialization', () => {
            const cronNode = createCronNode("test-cron", { cronTime: "0 */10 * * * *" });
            const debugNode = createDebuggerNode("debug");
            cronNode.to(debugNode);

            const serialized = serializeNodes([cronNode]);
            const parsed = JSON.parse(serialized);

            // Verify cron properties are preserved
            const cronSerialized = parsed.nodes.find((n: any) => n.name === 'test-cron');
            expect(cronSerialized.type).toBe('cronNode');
            expect(cronSerialized.properties.cronTime).toBe('0 */10 * * * *');
            expect(cronSerialized.isTrigger).toBe(true);

            // Deserialize and verify
            const { triggerNodes } = deserializeNodes(serialized);
            expect(triggerNodes).toHaveLength(1);
            expect(triggerNodes[0].name).toBe('test-cron');
            expect(triggerNodes[0].properties.cronTime).toBe('0 */10 * * * *');
        });

        it('should correctly identify trigger vs non-trigger nodes', () => {
            const cronNode = createCronNode("cron", { cronTime: "* * * * * *" });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const debugNode = createDebuggerNode("debug");

            cronNode.to(delayNode).to(debugNode);

            const serialized = serializeNodes([cronNode]);
            const parsed = JSON.parse(serialized);

            // Check trigger flags in serialized data
            const cronSerialized = parsed.nodes.find((n: any) => n.name === 'cron');
            const delaySerialized = parsed.nodes.find((n: any) => n.name === 'delay');
            const debugSerialized = parsed.nodes.find((n: any) => n.name === 'debug');

            expect(cronSerialized.isTrigger).toBe(true);
            expect(delaySerialized.isTrigger).toBe(false);
            expect(debugSerialized.isTrigger).toBe(false);

            // Verify deserialization identifies triggers correctly
            const { triggerNodes, allNodes } = deserializeNodes(serialized);
            expect(triggerNodes).toHaveLength(1);
            expect(triggerNodes[0].name).toBe('cron');
            expect(allNodes.size).toBe(3);
        });
    });

    describe('Flow Control Integration', () => {
        it('should start and stop all triggers with global controls', () => {
            const cron1 = createCronNode("cron-1", { cronTime: "0 */5 * * * *" });
            const cron2 = createCronNode("cron-2", { cronTime: "0 */10 * * * *" });
            const debug1 = createDebuggerNode("debug-1");
            const debug2 = createDebuggerNode("debug-2");

            cron1.to(debug1);
            cron2.to(debug2);

            const serialized = serializeNodes([cron1, cron2]);
            const { triggerNodes, startFlow, stopFlow } = deserializeNodes(serialized);

            expect(triggerNodes).toHaveLength(2);

            // Initially all should be stopped
            expect(triggerNodes.every(t => !t.isRunning())).toBe(true);

            // Start all triggers
            startFlow();
            expect(triggerNodes.every(t => t.isRunning())).toBe(true);

            // Stop all triggers
            stopFlow();
            expect(triggerNodes.every(t => !t.isRunning())).toBe(true);
        });

        it('should handle invalid trigger names gracefully', () => {
            const cronNode = createCronNode("valid-cron", { cronTime: "* * * * * *" });
            const debugNode = createDebuggerNode("debug");
            cronNode.to(debugNode);

            const serialized = serializeNodes([cronNode]);
            const { startTrigger, stopTrigger } = deserializeNodes(serialized);

            // Should not throw for invalid trigger names
            expect(() => startTrigger("non-existent")).not.toThrow();
            expect(() => stopTrigger("non-existent")).not.toThrow();
        });
    });

    describe('Real-world Flow Scenarios', () => {
        it('should handle complex branching flow with multiple triggers', () => {
            // Simulate a real-world scenario: scheduled job + file watcher -> processing pipeline
            const scheduledJob = createCronNode("daily-job", { cronTime: "0 0 2 * * *" }); // 2 AM daily
            const fileProcessor = createDebuggerNode("file-processor"); // Mock file watch
            const dataValidator = createDebuggerNode("validator");
            const dataSaver = createDelayNode("saver", { delay: 1000 }); // Simulate DB save delay
            const notifier = createDebuggerNode("notifier");

            // Create branching flow:
            // scheduledJob -> validator -> saver -> notifier
            // fileProcessor -> validator -> saver -> notifier
            scheduledJob.to(dataValidator);
            fileProcessor.to(dataValidator);
            dataValidator.to(dataSaver);
            dataSaver.to(notifier);

            const serialized = serializeNodes([scheduledJob, fileProcessor]);
            const parsed = JSON.parse(serialized);

            // Should handle the branching correctly (only trigger nodes become start nodes)
            expect(parsed.startNodes).toEqual(['daily-job']); // Only cron is a trigger node
            expect(parsed.nodes).toHaveLength(5);

            // Verify the structure
            const validatorNode = parsed.nodes.find((n: any) => n.name === 'validator');
            expect(validatorNode.connections).toEqual(['saver']);

            const saverNode = parsed.nodes.find((n: any) => n.name === 'saver');
            expect(saverNode.connections).toEqual(['notifier']);

            // Deserialize and verify flow control
            const { triggerNodes, allNodes } = deserializeNodes(serialized);
            expect(triggerNodes).toHaveLength(1); // Only real trigger (cron)
            expect(allNodes.size).toBe(5);
        });

        it('should preserve flow integrity through serialize-deserialize-reserialize cycles', () => {
            const cronNode = createCronNode("cycle-test", { cronTime: "0 0 * * * *" });
            const delayNode = createDelayNode("delay", { delay: 500 });
            const debugNode = createDebuggerNode("debug");

            cronNode.to(delayNode).to(debugNode);

            // First serialization
            const firstSerialization = serializeNodes([cronNode]);
            const firstDeserialization = deserializeNodes(firstSerialization);

            // Re-serialize from deserialized nodes
            const recreatedNodes = Array.from(firstDeserialization.allNodes.values());
            const secondSerialization = serializeNodes(recreatedNodes);

            // Parse both to compare
            const first = JSON.parse(firstSerialization);
            const second = JSON.parse(secondSerialization);

            // Should maintain identical structure
            expect(second.startNodes).toEqual(first.startNodes);
            expect(second.nodes).toHaveLength(first.nodes.length);

            // Each node should be preserved exactly
            first.nodes.forEach((originalNode: any) => {
                const matchingNode = second.nodes.find((n: any) => n.name === originalNode.name);
                expect(matchingNode).toBeDefined();
                expect(matchingNode.type).toBe(originalNode.type);
                expect(matchingNode.properties).toEqual(originalNode.properties);
                expect(matchingNode.connections).toEqual(originalNode.connections);
                expect(matchingNode.isTrigger).toBe(originalNode.isTrigger);
            });
        });
    });
});