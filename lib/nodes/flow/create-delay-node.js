import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';

const createDelayNode = /* @__PURE__ */ __name((name, props = {}) => {
  const { delay = 1e3 } = props;
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return msg;
  }, "process");
  return createNode({
    type: "delayNode",
    name,
    process,
    properties: { delay }
  });
}, "createDelayNode");

export { createDelayNode };
