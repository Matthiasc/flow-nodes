import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.js';

const createFunctionNode = /* @__PURE__ */ __name(({
  name,
  func
}) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    if (typeof func !== "function") {
      throw new Error("Function is missing");
    }
    msg.payload = await func({ msg, log, globals });
    return msg;
  }, "process");
  return createNode({ type: "functionNode", name, process });
}, "createFunctionNode");

export { createFunctionNode };
