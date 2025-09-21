import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createCronNode } from './create-cron-node.ts';
import { createNode } from '../lib/create-node.ts';

describe('createCronNode', () => {
    beforeEach(() => {
        // No mocking needed - we'll use real cron timing
    });

    afterEach(() => {
        // Clean up any running cron jobs if needed
    });

    it('should create a cron node with correct properties', async () => {
        let count = 0;

        const cronNode = createCronNode('test-cron', {
            cronTime: '* * * * * *',

        });

        const testNode = createNode({
            type: "testNode",
            name: "test",
            process: async ({ msg }) => {
                //count the executions here
                count++;
                return msg;
            }
        })

        cronNode.to(testNode);
        cronNode.start();

        await new Promise(resolve => setTimeout(resolve, 3005));

        expect(count).toBe(3);
    });

    it('should start and stop the cron job', () => {
        const cronNode = createCronNode('test-cron', {
            cronTime: '* * * * * *',

        });

        expect(cronNode.isRunning()).toBe(false);

        cronNode.start();
        expect(cronNode.isRunning()).toBe(true);

        cronNode.stop();
        expect(cronNode.isRunning()).toBe(false);
    });

    it('should not be running', () => {
        const cronNode = createCronNode('test-cron', {
            cronTime: '* * * * * *',

        });

        expect(cronNode.isRunning()).toBe(false);
    });



});