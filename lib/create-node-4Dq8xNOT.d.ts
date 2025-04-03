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

type Globals = {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
};

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

export type { Logger as L, Msg as M, Node as N, ProcessFn as P };
