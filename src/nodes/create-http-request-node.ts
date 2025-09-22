import { createNode, type ProcessFn, type NodeFactory } from "../lib/create-node.ts";

export type HttpRequestNodeProps = {
  url?: string;
  onProcessed?: (msg: any) => any;
};

export const createHttpRequestNode: NodeFactory<HttpRequestNodeProps> = (name, props = {}) => {
  const { url, onProcessed } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    const requestUrl = url || msg.payload?.url || msg.payload;

    if (!requestUrl) {
      throw new Error("HTTP request node requires a URL");
    }

    try {
      const response = await fetch(requestUrl);
      const data = await response.text();

      msg.payload = data;
      log.info(`HTTP GET request to ${requestUrl} completed with status ${response.status}`);

      if (onProcessed) {
        onProcessed(msg);
      }
    } catch (error: any) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }

    return msg;
  };

  return createNode({
    type: "httpRequestNode",
    name,
    process,
    properties: { url, onProcessed }
  });
};
createHttpRequestNode.nodeType = "httpRequestNode";
