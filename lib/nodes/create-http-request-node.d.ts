import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type HttpRequestNodeProps = {
    url?: string;
    onProcessed?: (msg: any) => any;
};
declare const createHttpRequestNode: NodeCreationFn<HttpRequestNodeProps>;

export { type HttpRequestNodeProps, createHttpRequestNode };
