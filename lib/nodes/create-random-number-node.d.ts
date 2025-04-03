import { N as Node, M as Msg, L as Logger } from '../create-node-4Dq8xNOT.js';

declare const createRandomNumberNode: ({ name, wholeNumber, range, }: {
    name: any;
    wholeNumber?: boolean;
    range?: number[];
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

export { createRandomNumberNode };
