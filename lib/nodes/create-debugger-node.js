import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.ts';

const createDebuggerNode = /* @__PURE__ */ __name(({ name }) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    console.log("log", log.getLogNiceOutput());
    console.log("msg", msg);
    return msg;
  }, "process");
  return createNode({ type: "debuggerNode", name, process });
}, "createDebuggerNode");

export { createDebuggerNode };
