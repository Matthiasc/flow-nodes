//TODO: I think for a cron node we need a different approach, as it should trigger messages on its own, not just when a message is received
//so we might need to implement a start/stop mechanism for the cron job
//a trigger node that can be started and stopped
//and that trigger node can then be connected to other nodes to start the flow
//this would require changes in the createNode function to handle nodes that can start flows on their own
//and also changes in the processConnected function to handle nodes that can start flows on their own
//or we could use an event emitter pattern where the cron node emits an event that other nodes can listen to and start processing
import { CronJob } from 'cron';
import { createNode, type ProcessFn } from "../lib/create-node.ts";

export const createCronNode = ({
    name,
    cronTime,
}: {
    name: string;
    cronTime: string;
}) => {

    const job = CronJob.from({
        cronTime,
        onTick: () => {
            const msg = { payload: null };
        },
        start: false,
    });



    const process: ProcessFn = async ({ msg, log, globals }) => {
        if (!job.isActive) {
            job.start();
        }
        return null;
    };

    return createNode({ type: "cronNode", name, process });
};
