import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type DebuggerNodeProps = {};
declare const createDebuggerNode: NodeCreationFn<DebuggerNodeProps>;

export { type DebuggerNodeProps, createDebuggerNode };
