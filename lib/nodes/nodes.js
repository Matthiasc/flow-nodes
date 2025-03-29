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
    console.log("rn", randomNumber);
    msg.payload = randomNumber;
    if (wholeNumber) msg.payload = Math.floor(randomNumber);
    console.log("pl", msg.payload);
    return msg;
  }, "process");
  return createNode({ type: "debuggerNode", name, process });
}, "createRandomNumberNode");
const createFunctionNode = /* @__PURE__ */ __name(({ name, func }) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    if (typeof msg.payload !== "object") {
      throw new Error("Input is not an object");
    }
    if (typeof func !== "function") {
      throw new Error("Function is missing");
    }
    msg.payload = await func(msg);
    return msg;
  }, "process");
  return createNode({ type: "functionNode", name, process });
}, "createFunctionNode");
const createRateLimitingNode = /* @__PURE__ */ __name(({
  name,
  limit = 1,
  interval = 1e3
}) => {
  let calls = 0;
  let lastReset = Date.now();
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    const now = Date.now();
    if (now - lastReset >= interval) {
      calls = 0;
      lastReset = now;
    }
    if (calls < limit) {
      calls++;
      return msg;
    } else {
      log.warn("Rate limit exceeded, dropping message");
      return null;
    }
  }, "process");
  return createNode({ type: "rateLimitingNode", name, process });
}, "createRateLimitingNode");

export { createFunctionNode, createRandomNumberNode, createRateLimitingNode };
