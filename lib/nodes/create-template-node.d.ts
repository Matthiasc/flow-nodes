import { Node, Msg } from '../lib/create-node.js';
import { Logger } from '../lib/create-logger.js';
import '../lib/create-globals.js';

declare const createTemplateNode: ({ name, template, }: {
    name: string;
    template: string;
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

export { createTemplateNode };
