import { createNode, type ProcessFn } from "../lib/create-node.ts";

export const createHttpRequestNode = ({
  name,
  url,
  onProcessed,
}: {
  name: string;
  url?: string;
  onProcessed?: (msg: any) => any;
}) => {
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
    } catch (error) {
      log.error(`Failed to fetch data from ${_url}: ${error.message}`);
      throw new Error(`Failed to fetch data from ${_url}: ${error.message}`);
    }
  };

  return createNode({ type: "fetchNode", name, process, onProcessed });
};
