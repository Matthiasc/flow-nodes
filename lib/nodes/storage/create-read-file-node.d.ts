import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

type ReadFileNodeProps = {
    filePath?: string;
    encoding?: BufferEncoding;
};
declare const createReadFileNode: NodeCreationFn<ReadFileNodeProps>;

export { type ReadFileNodeProps, createReadFileNode };
