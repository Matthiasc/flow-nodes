import { describe, it, expect } from 'vitest';
import { createCronNode } from '../nodes/create-cron-node';
import { createWatchFileNode } from '../nodes/storage/create-watch-file-node';
import { createDebuggerNode } from '../nodes/create-debugger-node';
import { createDelayNode } from '../nodes/flow/create-delay-node';
import { createRandomNumberNode } from '../nodes/create-random-number-node';
import { type NodeFactory, type TriggerNodeFactory } from '../lib/create-node';

describe('TypeScript Interface Tests', () => {
    describe('TriggerNodeFactory vs NodeFactory Types', () => {
        it('should have correct TypeScript interfaces for trigger nodes', () => {
            // TriggerNodeFactory should create nodes with start/stop/isRunning methods
            const cronNode = createCronNode("test-cron", { cronTime: "* * * * * *" });
            const watchNode = createWatchFileNode("test-watch", { filePath: "./test.txt" });

            // These should be TriggerNodes with trigger-specific methods
            expect(typeof cronNode.start).toBe('function');
            expect(typeof cronNode.stop).toBe('function');
            expect(typeof cronNode.isRunning).toBe('function');

            expect(typeof watchNode.start).toBe('function');
            expect(typeof watchNode.stop).toBe('function');
            expect(typeof watchNode.isRunning).toBe('function');
        });

        it('should have correct TypeScript interfaces for regular nodes', () => {
            // NodeFactory should create BaseNodes without trigger methods
            const debugNode = createDebuggerNode("test-debug");
            const delayNode = createDelayNode("test-delay", { delay: 100 });
            const randomNode = createRandomNumberNode("test-random", { range: [1, 10] });

            // These should NOT have trigger-specific methods
            expect(typeof (debugNode as any).start).toBe('undefined');
            expect(typeof (debugNode as any).stop).toBe('undefined');
            expect(typeof (debugNode as any).isRunning).toBe('undefined');

            expect(typeof (delayNode as any).start).toBe('undefined');
            expect(typeof (delayNode as any).stop).toBe('undefined');
            expect(typeof (delayNode as any).isRunning).toBe('undefined');

            expect(typeof (randomNode as any).start).toBe('undefined');
            expect(typeof (randomNode as any).stop).toBe('undefined');
            expect(typeof (randomNode as any).isRunning).toBe('undefined');
        });

        it('should have nodeType static properties on factories', () => {
            // All factories should have static nodeType properties
            expect((createCronNode as any).nodeType).toBe('cron');
            expect((createWatchFileNode as any).nodeType).toBe('watchFile');
            expect((createDebuggerNode as any).nodeType).toBe('debugger');
            expect((createDelayNode as any).nodeType).toBe('delay');
            expect((createRandomNumberNode as any).nodeType).toBe('randomNumber');
        });
    });

    describe('Interface Consistency', () => {
        it('should maintain consistent trigger node behavior', () => {
            const cronNode = createCronNode("consistency-cron", { cronTime: "0 */5 * * * *" });
            const watchNode = createWatchFileNode("consistency-watch", { filePath: "./test.txt" });

            // Initial state should be stopped
            expect(cronNode.isRunning()).toBe(false);
            expect(watchNode.isRunning()).toBe(false);

            // Start both triggers
            cronNode.start();
            watchNode.start();

            expect(cronNode.isRunning()).toBe(true);
            expect(watchNode.isRunning()).toBe(true);

            // Stop both triggers
            cronNode.stop();
            watchNode.stop();

            expect(cronNode.isRunning()).toBe(false);
            expect(watchNode.isRunning()).toBe(false);
        });

        it('should handle multiple start/stop calls gracefully', () => {
            const cronNode = createCronNode("multi-start", { cronTime: "* * * * * *" });

            // Multiple starts should not cause issues
            expect(cronNode.isRunning()).toBe(false);
            cronNode.start();
            expect(cronNode.isRunning()).toBe(true);
            cronNode.start(); // Second start
            expect(cronNode.isRunning()).toBe(true);

            // Multiple stops should not cause issues
            cronNode.stop();
            expect(cronNode.isRunning()).toBe(false);
            cronNode.stop(); // Second stop
            expect(cronNode.isRunning()).toBe(false);
        });

        it('should maintain base node functionality for all node types', () => {
            const cronNode = createCronNode("base-test-cron", { cronTime: "* * * * * *" });
            const debugNode = createDebuggerNode("base-test-debug");
            const delayNode = createDelayNode("base-test-delay", { delay: 100 });

            // All nodes should have base functionality
            const nodes = [cronNode, debugNode, delayNode];

            nodes.forEach(node => {
                // Base node properties
                expect(typeof node.name).toBe('string');
                expect(typeof node.type).toBe('string');
                expect(typeof node.properties).toBe('object');

                // Base node methods
                expect(typeof node.to).toBe('function');
                expect(typeof node.children).toBe('function');
                expect(typeof node.nodeTree).toBe('function');
                expect(typeof node.process).toBe('function');
                expect(typeof node.log).toBe('object');

                // Test connections work
                const children = node.children();
                expect(Array.isArray(children)).toBe(true);
            });
        });
    });

    describe('Type Safety and Factory Signatures', () => {
        it('should enforce correct props types for node factories', () => {
            // These should work with correct types
            const cronNode = createCronNode("type-safe-cron", { cronTime: "0 */10 * * * *" });
            expect(cronNode.properties.cronTime).toBe("0 */10 * * * *");

            const delayNode = createDelayNode("type-safe-delay", { delay: 1500 });
            expect(delayNode.properties.delay).toBe(1500);

            const randomNode = createRandomNumberNode("type-safe-random", {
                range: [5, 15],
                wholeNumber: true
            });
            expect(randomNode.properties.range).toEqual([5, 15]);
            expect(randomNode.properties.wholeNumber).toBe(true);

            const watchNode = createWatchFileNode("type-safe-watch", { filePath: "/tmp/test.log" });
            expect(watchNode.properties.filePath).toBe("/tmp/test.log");
        });

        it('should work with minimal or default props', () => {
            // These should work with defaults
            const debugNode = createDebuggerNode("minimal-debug"); // No props needed
            expect(debugNode.name).toBe("minimal-debug");
            expect(debugNode.type).toBe("debugger");

            // Optional props should get defaults
            const randomWithDefaults = createRandomNumberNode("default-random", {});
            expect(randomWithDefaults.properties.wholeNumber).toBe(false);
            expect(randomWithDefaults.properties.range).toEqual([0, 1]);

            const randomMinimal = createRandomNumberNode("minimal-random");
            expect(randomMinimal.properties.wholeNumber).toBe(false);
            expect(randomMinimal.properties.range).toEqual([0, 1]);
        });

        it('should demonstrate clear type distinction in usage', () => {
            // This test demonstrates the improved clarity of the type system

            // BEFORE: Confusing boolean flag approach
            // const createCronNode: NodeFactory<CronNodeProps, true> = ... 😕

            // AFTER: Crystal clear intent with separate interfaces
            // const createCronNode: TriggerNodeFactory<CronNodeProps> = ... 😍

            const cronFactory: TriggerNodeFactory = createCronNode;
            const debugFactory: NodeFactory = createDebuggerNode;

            // TypeScript now knows exactly what each factory produces
            const triggerNode = cronFactory("clear-cron", { cronTime: "* * * * * *" });
            const regularNode = debugFactory("clear-debug");

            // Trigger node has trigger methods
            expect(typeof triggerNode.start).toBe('function');
            expect(typeof triggerNode.stop).toBe('function');
            expect(typeof triggerNode.isRunning).toBe('function');

            // Regular node does not have trigger methods
            expect(typeof (regularNode as any).start).toBe('undefined');
            expect(typeof (regularNode as any).stop).toBe('undefined');
            expect(typeof (regularNode as any).isRunning).toBe('undefined');

            // Both have base node functionality
            expect(typeof triggerNode.to).toBe('function');
            expect(typeof regularNode.to).toBe('function');
        });
    });

    describe('Node Connection and Flow Building', () => {
        it('should maintain type safety when building flows', () => {
            const cronNode = createCronNode("flow-cron", { cronTime: "0 */5 * * * *" });
            const delayNode = createDelayNode("flow-delay", { delay: 500 });
            const debugNode = createDebuggerNode("flow-debug");

            // Building flow should maintain proper types
            const connectedNode = cronNode.to(delayNode);
            expect(connectedNode).toBe(delayNode);

            const finalNode = delayNode.to(debugNode);
            expect(finalNode).toBe(debugNode);

            // Chain building should work (but need to avoid undefined return)
            cronNode.to(delayNode);
            delayNode.to(debugNode);

            // Verify connections
            expect(cronNode.children()).toHaveLength(1);
            expect(cronNode.children()[0]).toBe(delayNode);
            expect(delayNode.children()).toHaveLength(1);
            expect(delayNode.children()[0]).toBe(debugNode);
            expect(debugNode.children()).toHaveLength(0);
        });

        it('should handle array connections properly', () => {
            const cronNode = createCronNode("array-cron", { cronTime: "* * * * * *" });
            const delay1 = createDelayNode("delay-1", { delay: 100 });
            const delay2 = createDelayNode("delay-2", { delay: 200 });
            const debugNode = createDebuggerNode("debug");

            // Connect to multiple nodes
            cronNode.to([delay1, delay2]);
            delay1.to(debugNode);
            delay2.to(debugNode);

            // Verify connections
            expect(cronNode.children()).toHaveLength(2);
            expect(cronNode.children()).toContain(delay1);
            expect(cronNode.children()).toContain(delay2);

            // Both delays should connect to debug
            expect(delay1.children()).toHaveLength(1);
            expect(delay1.children()[0]).toBe(debugNode);
            expect(delay2.children()).toHaveLength(1);
            expect(delay2.children()[0]).toBe(debugNode);
        });
    });
});