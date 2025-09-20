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

        const cronNode = createCronNode({
            name: 'test-cron',
            cronTime: '* * * * * *',
            autoStart: false
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

        await new Promise(resolve => setTimeout(resolve, 3100));

        expect(count).toBe(3);
    });

    it('should start and stop the cron job', () => {
        const cronNode = createCronNode({
            name: 'test-cron',
            cronTime: '* * * * * *',
            autoStart: false
        });

        expect(cronNode.isRunning()).toBe(false);

        cronNode.start();
        expect(cronNode.isRunning()).toBe(true);

        cronNode.stop();
        expect(cronNode.isRunning()).toBe(false);
    });

    it('should auto-start when autoStart is true', () => {
        const cronNode = createCronNode({
            name: 'test-cron',
            cronTime: '* * * * * *',
            autoStart: true
        });

        expect(cronNode.isRunning()).toBe(true);
        cronNode.stop(); // Clean up
    });

    it('should not auto-start when autoStart is false', () => {
        const cronNode = createCronNode({
            name: 'test-cron',
            cronTime: '* * * * * *',
            autoStart: false
        });

        expect(cronNode.isRunning()).toBe(false);
    });

    it('should use default autoStart value of true', () => {
        const cronNode = createCronNode({
            name: 'test-cron',
            cronTime: '* * * * * *'
            // autoStart not specified, should default to true
        });

        expect(cronNode.isRunning()).toBe(true);
        cronNode.stop(); // Clean up
    });




});