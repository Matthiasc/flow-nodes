import { __name } from '../chunk-SHUYVCID.js';

const createLogger = /* @__PURE__ */ __name((nodeName) => {
  const _nodeLog = [];
  let _messageLog = [];
  function addLog(type, message) {
    const time = (/* @__PURE__ */ new Date()).toISOString();
    _nodeLog.push({ time, type, nodeName, message });
    _messageLog && _messageLog.push({ time, type, nodeName, message });
  }
  __name(addLog, "addLog");
  return {
    info: /* @__PURE__ */ __name((message) => addLog("info", message), "info"),
    warn: /* @__PURE__ */ __name((message) => addLog("warn", message), "warn"),
    error: /* @__PURE__ */ __name((message) => addLog("error", message), "error"),
    getLog: /* @__PURE__ */ __name(() => [..._nodeLog], "getLog"),
    // clearLog: () => log.length = 0,
    setMessageLog: /* @__PURE__ */ __name((messageLog) => _messageLog = messageLog, "setMessageLog")
  };
}, "createLogger");
function prettyPrint(log) {
  return log.map(
    (log2) => `${log2.time} ${log2.type}: ${log2.nodeName} - ${log2.message}`
  );
}
__name(prettyPrint, "prettyPrint");

export { createLogger, prettyPrint };
