export type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  getLog: () => LogEntry[];
  getLogNiceOutput: () => string[];
};

export type LogEntry = {
  type: "info" | "warn" | "error";
  nodeName: string;
  message: string;
};

export const createLogger = (nodeName: string): Logger => {
  const log: LogEntry[] = [];

  return {
    info: (message) => log.push({ type: "info", nodeName, message }),
    warn: (message) => {
      log.push({ type: "warn", nodeName, message });
    },
    error: (message) => log.push({ type: "error", nodeName, message }),
    getLog: () => [...log],
    getLogNiceOutput: () =>
      log.map((log) => `${log.type}: ${log.nodeName} - ${log.message}`),
    // clearLog: () => log.length = 0,
  };
};
