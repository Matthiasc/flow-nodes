import { createNode } from "../lib/create-node.ts";

export const createHttpRequestNode = ({
  name,
  url,
  onProcessed,
}: {
  name: string;
  url?: string;
  onProcessed?: (msg: any) => any;
}) => {
  const process = async ({ msg, log, globals }) => {
    const _url = url || msg.url;

    if (!_url) {
      throw new Error("No URL provided");
    }

    try {
      console.info(`Fetching data from: ${_url}`);
      const response = await fetch(_url);
      const data = await response.text();
      msg.payload = data;
      return msg; // Return fetched data
    } catch (error) {
      // log.error(`Failed to fetch data from ${_url}: ${error.message}`);
      throw new Error(`Failed to fetch data from ${_url}: ${error.message}`);
    }
  };

  return createNode({ type: "fetchNode", name, process, onProcessed });
};
