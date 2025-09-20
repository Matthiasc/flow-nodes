import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

type PassThroughNodeProps = {};
declare const createPassThroughNode: NodeCreationFn<PassThroughNodeProps>;

export { type PassThroughNodeProps, createPassThroughNode };
