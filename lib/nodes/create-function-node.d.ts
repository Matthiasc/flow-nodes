import { NodeCreationFn, ProcessFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

interface FunctionNodeProps {
    func: ProcessFn;
}
declare const createFunctionNode: NodeCreationFn<FunctionNodeProps>;

export { createFunctionNode };
