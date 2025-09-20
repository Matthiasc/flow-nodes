import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type CronNodeProps = {
    cronTime: string;
    autoStart?: boolean;
};
declare const createCronNode: NodeCreationFn<CronNodeProps>;

export { type CronNodeProps, createCronNode };
