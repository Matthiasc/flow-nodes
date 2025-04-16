import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.js';
import { promises } from 'fs';
import path from 'path';

const createWriteFileNode = /* @__PURE__ */ __name(({
  name,
  filePath,
  createDir = true,
  appendToFile = true,
  newline = true
}) => {
  if (!filePath) throw new Error("filePath is required");
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    try {
      if (createDir) {
        await promises.mkdir(path.dirname(filePath), { recursive: true });
      }
      const data = msg.payload + (newline ? "\n" : "");
      const writeMethod = appendToFile ? promises.appendFile : promises.writeFile;
      await writeMethod(filePath, data);
      log.info(`Msg ${appendToFile ? "appended" : "written"} to ${filePath}`);
    } catch (error) {
      log.error(`Failed to write message: ${error.message}`);
    }
    return msg;
  }, "process");
  return createNode({ type: "writeToFileNode", name, process });
}, "createWriteFileNode");

export { createWriteFileNode };
