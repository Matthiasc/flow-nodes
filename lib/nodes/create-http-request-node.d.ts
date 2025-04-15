import { N as Node, M as Msg, L as Logger } from '../create-node-BNJMA075.js';

declare const createHttpRequestNode: ({ name, url, onProcessed, }: {
    name: string;
    url?: string;
    onProcessed?: (msg: any) => any;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

export { createHttpRequestNode };
