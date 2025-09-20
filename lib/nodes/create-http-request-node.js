import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.ts';

const createHttpRequestNode = /* @__PURE__ */ __name((name, props = {}) => {
  const { url, onProcessed } = props;
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    const _url = url || msg.url;
    if (!_url) {
      throw new Error("No URL provided");
    }
    try {
      const response = await fetch(_url);
      const data = await response.text();
      msg.payload = data;
      log.info(`Fetched data from: ${_url}`);
      return msg;
    } catch (error) {
      log.error(`Failed to fetch data from ${_url}: ${error.message}`);
      throw new Error(`Failed to fetch data from ${_url}: ${error.message}`);
    }
  }, "process");
  return createNode({
    type: "fetchNode",
    name,
    process,
    onProcessed,
    properties: { url }
  });
}, "createHttpRequestNode");

export { createHttpRequestNode };
