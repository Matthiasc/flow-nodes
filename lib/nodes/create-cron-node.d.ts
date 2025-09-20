import { Logger } from '../lib/create-logger.js';
import { Node, Msg } from '../lib/create-node.js';
import '../lib/create-globals.js';

declare const createCronNode: ({ name, cronTime, autoStart, }: {
    name: string;
    cronTime: string;
    autoStart?: boolean;
}) => {
    start: () => void;
    stop: () => void;
    isRunning: () => boolean;
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

export { createCronNode };
