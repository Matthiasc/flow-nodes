import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.js';

const createHttpRequestNode = /* @__PURE__ */ __name(({
  name,
  url,
  onProcessed
}) => {
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
  return createNode({ type: "fetchNode", name, process, onProcessed });
}, "createHttpRequestNode");

export { createHttpRequestNode };
