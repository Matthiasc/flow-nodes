import { describe, it, expect } from 'vitest';
import { serializeFlow, serializeNodes, deserializeFlow, deserializeNodes } from './serialize-flow';
import { createNode, type NodeFactory, type TriggerNodeFactory } from './create-node';
import { createCronNode } from '../nodes/create-cron-node';
import { createRandomNumberNode } from '../nodes/create-random-number-node';

// Create test custom node factories with static nodeType properties
const createCustomTestNode = Object.assign((name: string, { message }: { message: string }) => {
    return createNode({
        type: 'customTest',
        name,
        process: async ({ msg, log, globals }) => {
            log.info(`Custom test: ${message}`);
            return { ...msg, customMessage: message };
        },
        properties: { message }
    });
}, { nodeType: 'customTest' }) as NodeFactory;

const createCustomCalculatorNode = Object.assign((name: string, { operation, value }: { operation: 'add' | 'multiply'; value: number }) => {
    return createNode({
        type: 'customCalculator',
        name,
        process: async ({ msg, log, globals }) => {
            const input = msg.value || 0;
            const result = operation === 'add' ? input + value : input * value;
            log.info(`Custom calculator: ${input} ${operation} ${value} = ${result}`);
            return { ...msg, value: result };
        },
        properties: { operation, value }
    });
}, { nodeType: 'customCalculator' }) as NodeFactory;

// For trigger nodes, we'll create a simpler version that works with the base createNode
const createCustomTriggerNode = Object.assign((name: string, { interval }: { interval: number }) => {
    const node = createNode({
        type: 'customTrigger',
        name,
        process: async ({ msg, log, globals }) => {
            log.info(`Custom trigger activated: ${name}`);
            return msg;
        },
        properties: { interval }
    });

    // Add trigger functionality to base node
    let intervalId: NodeJS.Timeout | null = null;

    const triggerNode = {
        ...node,
        start: () => {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    node.process({
                        msg: { payload: { timestamp: Date.now() } }
                    });
                }, interval);
            }
        },
        stop: () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        isRunning: () => intervalId !== null
    };

    return triggerNode;
}, { nodeType: 'customTrigger' }) as TriggerNodeFactory;

describe('Custom Factories', () => {
    describe('Static nodeType Properties', () => {
        it('should have nodeType property on factory functions', () => {
            expect(createCustomTestNode.nodeType).toBe('customTest');
            expect(createCustomCalculatorNode.nodeType).toBe('customCalculator');
            expect(createCustomTriggerNode.nodeType).toBe('customTrigger');
        });

        it('should handle built-in factories with nodeType properties', () => {
            expect(createCronNode.nodeType).toBe('cron');
            expect(createRandomNumberNode.nodeType).toBe('randomNumber');
        });
    });

    describe('Array Format Custom Factories', () => {
        it('should serialize and deserialize custom nodes using array format', () => {
            // Create flow with custom nodes
            const testNode = createCustomTestNode('test1', { message: 'Hello Test' });
            const calcNode = createCustomCalculatorNode('calc1', { operation: 'add', value: 10 });
            const triggerNode = createCustomTriggerNode('trigger1', { interval: 1000 });

            // Connect nodes: trigger -> test -> calc
            triggerNode.to(testNode);
            testNode.to(calcNode);

            const nodes = [testNode, calcNode, triggerNode];

            // Serialize
            const serialized = serializeFlow(nodes);

            expect(serialized.nodes).toHaveLength(3);
            expect(serialized.startNodes).toEqual(['trigger1']);

            // Check node properties are preserved
            const testNodeSerialized = serialized.nodes.find(n => n.name === 'test1');
            expect(testNodeSerialized?.type).toBe('customTest');
            expect(testNodeSerialized?.properties.message).toBe('Hello Test');

            const calcNodeSerialized = serialized.nodes.find(n => n.name === 'calc1');
            expect(calcNodeSerialized?.type).toBe('customCalculator');
            expect(calcNodeSerialized?.properties.operation).toBe('add');
            expect(calcNodeSerialized?.properties.value).toBe(10);

            // Deserialize using array format
            const deserialized = deserializeFlow(serialized, [
                createCustomTestNode,
                createCustomCalculatorNode,
                createCustomTriggerNode
            ]);

            expect(deserialized.allNodes.size).toBe(3);
            expect(deserialized.triggerNodes).toHaveLength(1);
            expect(deserialized.triggerNodes[0].name).toBe('trigger1');

            // Verify properties were restored
            const restoredTest = deserialized.getNode('test1');
            expect(restoredTest?.type).toBe('customTest');
            expect(restoredTest?.properties.message).toBe('Hello Test');

            const restoredCalc = deserialized.getNode('calc1');
            expect(restoredCalc?.type).toBe('customCalculator');
            expect(restoredCalc?.properties.operation).toBe('add');
            expect(restoredCalc?.properties.value).toBe(10);
        });

        it('should deserialize mixed built-in and custom nodes', () => {
            // Create mixed flow
            const cronNode = createCronNode('cron1', { cronTime: '0 9 * * *' });
            const customNode = createCustomTestNode('custom1', { message: 'Mixed flow test' });
            const randomNode = createRandomNumberNode('random1', { range: [1, 100] });

            cronNode.to(customNode);
            customNode.to(randomNode);

            const nodes = [cronNode, customNode, randomNode];
            const serialized = serializeFlow(nodes);

            // Deserialize with only custom factories (built-ins should be auto-included)
            const deserialized = deserializeFlow(serialized, [createCustomTestNode]);

            expect(deserialized.allNodes.size).toBe(3);
            expect(deserialized.triggerNodes).toHaveLength(1);
            expect(deserialized.triggerNodes[0].name).toBe('cron1');

            // All nodes should be properly restored
            expect(deserialized.getNode('cron1')?.type).toBe('cron');
            expect(deserialized.getNode('custom1')?.type).toBe('customTest');
            expect(deserialized.getNode('random1')?.type).toBe('randomNumber');
        });

        it('should handle multiple custom factories of different types', () => {
            const testFactory1 = Object.assign((name: string, props: any) =>
                createNode({ type: 'type1', name, process: async ({ msg }) => msg, properties: props }),
                { nodeType: 'type1' }
            ) as NodeFactory;

            const testFactory2 = Object.assign((name: string, props: any) =>
                createNode({ type: 'type2', name, process: async ({ msg }) => msg, properties: props }),
                { nodeType: 'type2' }
            ) as NodeFactory;

            const testFactory3 = Object.assign((name: string, props: any) =>
                createNode({ type: 'type3', name, process: async ({ msg }) => msg, properties: props }),
                { nodeType: 'type3' }
            ) as NodeFactory;

            const node1 = testFactory1('node1', { prop: 'value1' });
            const node2 = testFactory2('node2', { prop: 'value2' });
            const node3 = testFactory3('node3', { prop: 'value3' });

            const serialized = serializeFlow([node1, node2, node3]);
            const deserialized = deserializeFlow(serialized, [testFactory1, testFactory2, testFactory3]);

            expect(deserialized.allNodes.size).toBe(3);
            expect(deserialized.getNode('node1')?.type).toBe('type1');
            expect(deserialized.getNode('node2')?.type).toBe('type2');
            expect(deserialized.getNode('node3')?.type).toBe('type3');
        });
    });

    describe('deserializeNodes helper', () => {
        it('should work with custom factories using array format', () => {
            const nodes = [
                createCustomTestNode('test1', { message: 'Test message' }),
                createCustomCalculatorNode('calc1', { operation: 'multiply', value: 5 })
            ];

            const serialized = serializeNodes(nodes);
            const deserialized = deserializeNodes(serialized, [createCustomTestNode, createCustomCalculatorNode]);

            expect(deserialized.allNodes.size).toBe(2);
            expect(deserialized.getNode('test1')?.properties.message).toBe('Test message');
            expect(deserialized.getNode('calc1')?.properties.operation).toBe('multiply');
            expect(deserialized.getNode('calc1')?.properties.value).toBe(5);
        });

        it('should handle JSON string input', () => {
            const nodes = [createCustomTestNode('test1', { message: 'JSON test' })];
            const serialized = serializeNodes(nodes);

            // Test with JSON string instead of object
            const deserialized = deserializeNodes(serialized, [createCustomTestNode]);

            expect(deserialized.allNodes.size).toBe(1);
            expect(deserialized.getNode('test1')?.properties.message).toBe('JSON test');
        });
    });

    describe('Error Handling', () => {
        it('should throw error for factory without nodeType property', () => {
            const invalidFactory = ((name: string, props: any) =>
                createNode({ type: 'invalid', name, process: async ({ msg }) => msg, properties: props })
            ) as NodeFactory;
            // Note: no nodeType property assigned

            expect(() => {
                deserializeFlow({ nodes: [], startNodes: [] }, [invalidFactory]);
            }).toThrow(/missing nodeType property/);
        });

        it('should throw error for unknown node type', () => {
            const serialized = {
                nodes: [{
                    id: 'unknown1',
                    name: 'unknown1',
                    type: 'unknownType',
                    properties: {},
                    connections: []
                }],
                startNodes: []
            };

            expect(() => {
                deserializeFlow(serialized, [createCustomTestNode]);
            }).toThrow(/Unknown node type: unknownType/);
        });

        it('should warn about duplicate node types and use the later one', () => {
            const factory1 = Object.assign((name: string, props: any) =>
                createNode({ type: 'duplicate', name: name + '_v1', process: async ({ msg }) => msg, properties: props }),
                { nodeType: 'duplicate' }
            ) as NodeFactory;

            const factory2 = Object.assign((name: string, props: any) =>
                createNode({ type: 'duplicate', name: name + '_v2', process: async ({ msg }) => msg, properties: props }),
                { nodeType: 'duplicate' }
            ) as NodeFactory;

            const serialized = {
                nodes: [{
                    id: 'test1',
                    name: 'test1',
                    type: 'duplicate',
                    properties: {},
                    connections: []
                }],
                startNodes: []
            };

            // Should not throw, but should use the second factory
            const deserialized = deserializeFlow(serialized, [factory1, factory2]);
            const node = deserialized.getNode('test1');

            // Should use factory2 (the later one) - check name suffix
            expect(node?.name).toBe('test1_v2');
        });
    });

    describe('Flow Control Integration', () => {
        it('should properly handle trigger nodes with custom factories', () => {
            const triggerNode = createCustomTriggerNode('trigger1', { interval: 100 });
            const testNode = createCustomTestNode('test1', { message: 'Triggered' });

            triggerNode.to(testNode);

            const serialized = serializeFlow([triggerNode, testNode]);
            const deserialized = deserializeFlow(serialized, [createCustomTriggerNode, createCustomTestNode]);

            expect(deserialized.triggerNodes).toHaveLength(1);
            expect(deserialized.triggerNodes[0].name).toBe('trigger1');

            // Test flow control
            expect(typeof deserialized.startFlow).toBe('function');
            expect(typeof deserialized.stopFlow).toBe('function');
            expect(typeof deserialized.startTrigger).toBe('function');
            expect(typeof deserialized.stopTrigger).toBe('function');
        });

        it('should maintain connections after deserialization', () => {
            const node1 = createCustomTestNode('node1', { message: 'First' });
            const node2 = createCustomCalculatorNode('node2', { operation: 'add', value: 5 });
            const node3 = createCustomTestNode('node3', { message: 'Last' });

            node1.to(node2);
            node2.to(node3);

            const serialized = serializeFlow([node1, node2, node3]);
            const deserialized = deserializeFlow(serialized, [createCustomTestNode, createCustomCalculatorNode]);

            const restoredNode1 = deserialized.getNode('node1');
            const restoredNode2 = deserialized.getNode('node2');

            // Check that connections were restored by checking the children
            expect(restoredNode1?.children()).toHaveLength(1);
            expect(restoredNode1?.children()[0].name).toBe('node2');
            expect(restoredNode2?.children()).toHaveLength(1);
            expect(restoredNode2?.children()[0].name).toBe('node3');
        });
    });

    describe('Round-trip Serialization', () => {
        it('should maintain data integrity through serialize -> deserialize -> serialize cycles', () => {
            const original = [
                createCustomTestNode('test1', { message: 'Original message' }),
                createCustomCalculatorNode('calc1', { operation: 'multiply', value: 42 }),
                createCustomTriggerNode('trigger1', { interval: 5000 })
            ];

            // First serialization
            const serialized1 = serializeFlow(original);

            // Deserialize
            const deserialized = deserializeFlow(serialized1, [
                createCustomTestNode,
                createCustomCalculatorNode,
                createCustomTriggerNode
            ]);

            // Second serialization from deserialized nodes
            const nodesArray = Array.from(deserialized.allNodes.values());
            const serialized2 = serializeFlow(nodesArray);

            // Should be identical
            expect(serialized2.nodes).toHaveLength(serialized1.nodes.length);
            expect(serialized2.startNodes).toEqual(serialized1.startNodes);

            // Check each node preserved its properties
            serialized1.nodes.forEach(originalNode => {
                const roundTripNode = serialized2.nodes.find(n => n.name === originalNode.name);
                expect(roundTripNode).toBeDefined();
                expect(roundTripNode?.type).toBe(originalNode.type);
                expect(roundTripNode?.properties).toEqual(originalNode.properties);
                expect(roundTripNode?.connections).toEqual(originalNode.connections);
            });
        });
    });
});