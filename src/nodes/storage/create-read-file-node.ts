import { createNode, type ProcessFn, type NodeFactory } from "../../lib/create-node.ts";
import { readFile } from "fs/promises";

export type ReadFileNodeProps = {
  filePath?: string;
  encoding?: BufferEncoding;
};

export const createReadFileNode: NodeFactory<ReadFileNodeProps> = (name, props = {}) => {
  let { filePath, encoding = "utf-8" } = props;
  const process: ProcessFn = async ({ msg, log, globals }) => {
    filePath = msg.filePath || filePath;
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
    type: "readFile",
    name,
    process,
    properties: { filePath, encoding }
  });
};
createReadFileNode.nodeType = "readFile";
