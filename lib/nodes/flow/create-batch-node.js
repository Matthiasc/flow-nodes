import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';

const createBatchNode = /* @__PURE__ */ __name(({ name, numberOfMessages = 5 }) => {
  const messages = [];
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    messages.push(msg);
    if (messages.length < numberOfMessages) {
      log.info("queueing message");
      return null;
    }
    log.info(`${messages.length} batched messages`);
    const result = [...messages];
    messages.length = 0;
    return result;
  }, "process");
  return createNode({ type: "batchNode", name, process });
}, "createBatchNode");

export { createBatchNode };
