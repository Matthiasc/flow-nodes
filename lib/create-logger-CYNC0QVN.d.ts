type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    getLog: () => LogEntry[];
    getLogNiceOutput: () => string[];
};
type LogEntry = {
    type: "info" | "warn" | "error";
    nodeName: string;
    message: string;
};

export type { Logger as L };
