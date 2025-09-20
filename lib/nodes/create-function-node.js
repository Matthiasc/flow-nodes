import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.ts';

const createFunctionNode = /* @__PURE__ */ __name((name, props) => {
  if (!props || !props.func) {
    throw new Error("Function node requires a func property");
  }
  const { func } = props;
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
