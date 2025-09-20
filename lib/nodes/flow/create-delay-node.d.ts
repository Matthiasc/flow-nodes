import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

type DelayNodeProps = {
    delay?: number;
};
declare const createDelayNode: NodeCreationFn<DelayNodeProps>;

export { type DelayNodeProps, createDelayNode };
