import { __name } from '../chunk-SHUYVCID.js';
import { prettyPrint } from '../lib/create-logger.js';
import { createNode } from '../lib/create-node.js';

const createDebuggerNode = /* @__PURE__ */ __name(({ name }) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    msg.log && console.log("log", prettyPrint(msg.log));
    console.log("msg", msg?.payload);
    return msg;
  }, "process");
  return createNode({ type: "debuggerNode", name, process });
}, "createDebuggerNode");

export { createDebuggerNode };
