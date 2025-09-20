import { createNode, type ProcessFn, type NodeCreationFn } from "../lib/create-node.ts";

export type HttpRequestNodeProps = {
  url?: string;
  onProcessed?: (msg: any) => any;
};

export const createHttpRequestNode: NodeCreationFn<HttpRequestNodeProps> = (name, props = {}) => {
  const { url, onProcessed } = props;
  const process: ProcessFn = async ({ msg, log, globals }) => {
    // @ts-ignore
    const _url = url || msg.url;

    if (!_url) {
      throw new Error("No URL provided");
    }

    try {
      const response = await fetch(_url);
      const data = await response.text();
      msg.payload = data;
      log.info(`Fetched data from: ${_url}`);
      return msg; // Return fetched data
    } catch (error: any) {
      log.error(`Failed to fetch data from ${_url}: ${error.message}`);
      throw new Error(`Failed to fetch data from ${_url}: ${error.message}`);
    }
  };

  return createNode({
    type: "fetchNode",
    name,
    process,
    onProcessed,
    properties: { url }
  });
};
