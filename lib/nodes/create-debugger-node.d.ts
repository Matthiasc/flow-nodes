import { L as Logger } from '../create-logger-CYNC0QVN.js';

declare const createDebuggerNode: ({ name }: {
    name: any;
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

export { createDebuggerNode };
