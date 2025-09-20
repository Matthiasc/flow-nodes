import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

interface WriteFileNodeProps {
    filePath: string;
    createDir?: boolean;
    appendToFile?: boolean;
    newline?: boolean;
}
declare const createWriteFileNode: NodeCreationFn<WriteFileNodeProps>;

export { createWriteFileNode };
