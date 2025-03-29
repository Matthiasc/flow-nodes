import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.ts';

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
      console.info(`Fetching data from: ${_url}`);
      const response = await fetch(_url);
      const data = await response.text();
      msg.payload = data;
      return msg;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${_url}: ${error.message}`);
    }
  }, "process");
  return createNode({ type: "fetchNode", name, process, onProcessed });
}, "createHttpRequestNode");

export { createHttpRequestNode };
