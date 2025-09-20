import { Globals } from './create-globals.js';
import { LogEntry, Logger } from './create-logger.js';

type Node = any;
type Msg = {
    payload?: any;
    log?: LogEntry[];
    [key: string]: any;
};
type NodeCreationFn<T = any> = (name: string, props?: T) => Node;
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
    properties?: Record<string, any>;
};
declare const createNode: ({ type, name, process: processFn, onProcessed, properties, }: CreateNode) => {
    name: string;
    type: string;
    properties: Record<string, any>;
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

export { type Msg, type Node, type NodeCreationFn, type ProcessFn, createNode };
