import { __name } from '../chunk-SHUYVCID.js';
import { prettyPrint } from '../lib/create-logger.ts';
import { createNode } from '../lib/create-node.ts';

const createDebuggerNode = /* @__PURE__ */ __name((name, props = {}) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    msg.log && console.log("log", prettyPrint(msg.log));
    console.log("msg", msg?.payload);
    return msg;
  }, "process");
  return createNode({
    type: "debuggerNode",
    name,
    process,
    properties: {}
  });
}, "createDebuggerNode");

export { createDebuggerNode };
