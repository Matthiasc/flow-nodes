import { createNode, type ProcessFn } from "../../lib/create-node.ts";
import { readFile } from "fs/promises";

export const createReadFileNode = ({
  name,
  filePath,
  encoding = "utf-8",
}: {
  name: string;
  filePath?: string;
  encoding?: BufferEncoding;
}) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    filePath = msg.payload || filePath;
    if (!filePath) throw new Error("No filePath provided");

    encoding = msg.encoding || encoding || "utf-8";

    try {
      const content = await readFile(filePath, encoding);
      msg.payload = content;
      log.info(`Read file ${filePath}`);
      return msg;
    } catch (error) {
      log.error(`Error reading file: ${error}`);
      throw error;
    }
  };

  return createNode({ type: "debuggerNode", name, process });
};
