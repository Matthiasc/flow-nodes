import { createNode, type ProcessFn, type NodeCreationFn } from "../../lib/create-node.ts";
import { readFile } from "fs/promises";

export type ReadFileNodeProps = {
  filePath?: string;
  encoding?: BufferEncoding;
};

export const createReadFileNode: NodeCreationFn<ReadFileNodeProps> = (name, props = {}) => {
  let { filePath, encoding = "utf-8" } = props;
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

  return createNode({
    type: "readFileNode",
    name,
    process,
    properties: { filePath, encoding }
  });
};
