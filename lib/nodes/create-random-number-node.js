import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.ts';

const createRandomNumberNode = /* @__PURE__ */ __name(({
  name,
  wholeNumber = false,
  range = [0, 1]
}) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];
    msg.payload = randomNumber;
    if (wholeNumber) msg.payload = Math.floor(randomNumber);
    return msg;
  }, "process");
  return createNode({ type: "randomNumberNode", name, process });
}, "createRandomNumberNode");

export { createRandomNumberNode };
