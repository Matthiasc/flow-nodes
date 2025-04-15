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
declare function prettyPrint(log: LogEntry[]): string[];

export { type LogEntry, type LogLevel, type Logger, createLogger, prettyPrint };
