import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';

const createPassThroughNode = /* @__PURE__ */ __name((name, props = {}) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    return msg;
  }, "process");
  return createNode({
    type: "passThroughNode",
    name,
    process,
    properties: {}
  });
}, "createPassThroughNode");

export { createPassThroughNode };
