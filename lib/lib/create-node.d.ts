import { Globals } from './create-globals.js';
import { LogEntry, Logger } from './create-logger.js';

type Node = any;
type Msg = {
    payload?: any;
    log?: LogEntry[];
    [key: string]: any;
};
type ProcessFn = ({ msg, log, globals, }: {
    msg: Msg;
    log: Logger;
    globals: Globals;
}) => Promise<Msg | Msg[] | null> | null;
type CreateNode = {
    type: string;
    name: string;
    process: ProcessFn;
    onProcessed?: ({ msg }: {
        msg: Msg;
    }) => void;
};
declare const createNode: ({ type, name, process: processFn, onProcessed, }: CreateNode) => {
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

export { type Msg, type Node, type ProcessFn, createNode };
