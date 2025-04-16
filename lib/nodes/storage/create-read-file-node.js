import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.js';
import { readFile } from 'fs/promises';

const createReadFileNode = /* @__PURE__ */ __name(({
  name,
  filePath,
  encoding = "utf-8"
}) => {
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
  return createNode({ type: "debuggerNode", name, process });
}, "createReadFileNode");

export { createReadFileNode };
