import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';

const createRateLimitingNode = /* @__PURE__ */ __name((name, props = {}) => {
  const { limit = 1, interval = 1e3 } = props;
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
      log.info("Rate limit exceeded, dropping message");
      return null;
    }
  }, "process");
  return createNode({
    type: "rateLimitingNode",
    name,
    process,
    properties: { limit, interval }
  });
}, "createRateLimitingNode");

export { createRateLimitingNode };
