export type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  getLog: () => LogEntry[];
  setMessageLog: (messageLog: LogEntry[]) => void;
};

export type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
  type: LogLevel;
  nodeName: string;
  message: string;
};

export const createLogger = (nodeName: string): Logger => {
  const _nodeLog: LogEntry[] = [];
  let _messageLog: LogEntry[] = [];

  function addLog(type: LogLevel, message: string) {
    _nodeLog.push({ type, nodeName, message });
    _messageLog && _messageLog.push({ type, nodeName, message });
  }

  return {
    info: (message) => addLog("info", message),
    warn: (message) => addLog("warn", message),
    error: (message) => addLog("error", message),
    getLog: () => [..._nodeLog],
    // clearLog: () => log.length = 0,
    setMessageLog: (messageLog) => (_messageLog = messageLog),
  };
};

export function prettyPrint(log: LogEntry[]) {
  return log.map((log) => `${log.type}: ${log.nodeName} - ${log.message}`);
}
