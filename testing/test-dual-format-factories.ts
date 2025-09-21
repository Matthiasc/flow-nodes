import { serializeNodes, deserializeNodes } from '../src/lib/serialize-flow';
import { createCronNode } from '../src/nodes/create-cron-node';
import { createNode } from '../src/lib/create-node';

// Test custom node factory with static nodeType
const createCustomTestNode = Object.assign((name: string, { message }: { message: string }) => {
    return createNode({
        type: 'customTest',
        name,
        process: async ({ msg, log, globals }) => {
            console.log(`Custom test: ${message}`);
            return msg;
        },
        properties: { message }
    });
}, { nodeType: 'customTest' });

// Test the dual format support
async function testDualFormatFactories() {
    console.log('Testing dual-format custom factories...');
    
    // Create some test nodes
    const node1 = createCronNode('cron1', { cronTime: '0 9 * * *' });
    const node2 = createCustomTestNode('custom1', { message: 'Hello World' });
    
    const nodes = [node1, node2];
    
    // Serialize the nodes
    const serialized = serializeNodes(nodes);
    console.log('Serialized:', JSON.stringify(serialized, null, 2));
    
    // Test deserialization with array format (using static nodeType properties)
    console.log('\n--- Testing Array Format ---');
    try {
        const deserializedFromArray = deserializeNodes(serialized, [createCronNode, createCustomTestNode]);
        console.log('✅ Array format deserialization successful!');
        console.log('Deserialized nodes:', Array.from(deserializedFromArray.allNodes.values()).map(n => ({ name: n.name, type: n.type })));
    } catch (error) {
        console.log('❌ Array format failed:', error);
    }
    
    // Test deserialization with object format (traditional)
    console.log('\n--- Testing Object Format ---');
    try {
        const deserializedFromObject = deserializeNodes(serialized, {
            cronNode: createCronNode,
            customTest: createCustomTestNode
        });
        console.log('✅ Object format deserialization successful!');
        console.log('Deserialized nodes:', Array.from(deserializedFromObject.allNodes.values()).map(n => ({ name: n.name, type: n.type })));
    } catch (error) {
        console.log('❌ Object format failed:', error);
    }
    
    // Test that static nodeType property is accessible
    console.log('\n--- Testing Static Properties ---');
    console.log(`createCronNode.nodeType: ${(createCronNode as any).nodeType}`);
    console.log(`createCustomTestNode.nodeType: ${(createCustomTestNode as any).nodeType}`);
}

testDualFormatFactories().catch(console.error);