import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

type BatchNodeProps = {
    numberOfMessages?: number;
};
declare const createBatchNode: NodeCreationFn<BatchNodeProps>;

export { type BatchNodeProps, createBatchNode };
