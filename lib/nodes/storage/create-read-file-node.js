import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';
import { readFile } from 'fs/promises';

const createReadFileNode = /* @__PURE__ */ __name((name, props = {}) => {
  let { filePath, encoding = "utf-8" } = props;
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
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
  }, "process");
  return createNode({
    type: "readFileNode",
    name,
    process,
    properties: { filePath, encoding }
  });
}, "createReadFileNode");

export { createReadFileNode };
