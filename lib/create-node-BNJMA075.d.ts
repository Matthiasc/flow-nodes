declare const createGlobals: () => Globals;
type Globals = {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
};

type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    getLog: () => LogEntry[];
    setMessageLog: (messageLog: LogEntry[]) => void;
};
type LogLevel = "info" | "warn" | "error";
type LogEntry = {
    time: string;
    type: LogLevel;
    nodeName: string;
    message: string;
};
declare const createLogger: (nodeName: string) => Logger;

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

export { type Logger as L, type Msg as M, type Node as N, type ProcessFn as P, createLogger as a, createGlobals as b, createNode as c };
