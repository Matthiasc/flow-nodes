import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type RandomNumberNodeProps = {
    wholeNumber?: boolean;
    range?: [number, number];
};
declare const createRandomNumberNode: NodeCreationFn<RandomNumberNodeProps>;

export { type RandomNumberNodeProps, createRandomNumberNode };
