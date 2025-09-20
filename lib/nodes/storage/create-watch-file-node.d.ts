import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

interface WatchFileNodeProps {
    filePath: string;
}
declare const createWatchFileNode: NodeCreationFn<WatchFileNodeProps>;

export { createWatchFileNode };
