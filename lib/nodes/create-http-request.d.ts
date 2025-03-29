import { L as Logger } from '../create-logger-CYNC0QVN.js';

declare const createHttpRequestNode: ({ name, url, onProcessed, }: {
    name: string;
    url?: string;
    onProcessed?: (msg: any) => any;
}) => {
    name: string;
    type: string;
    to: (node: any) => any;
    children: () => any[];
    nodeTree: () => {
        node: any;
        children?: any[];
    }[];
    process: ({ msg, log, globals, }: {
        msg: {};
        log?: Logger;
        globals?: any;
    }) => Promise<void>;
};

export { createHttpRequestNode };
