import { createNode } from "../../lib/create-node.ts";
import { promises as fs } from "fs";
import path from "path";

export const createWriteToFileNode = ({
  name,
  filePath,
  createDir = true,
  appendToFile = true,
  newline = true,
}) => {
  if (!filePath) throw new Error("filePath is required");

  const process = async ({ msg, log, globals }) => {
    try {
      if (createDir) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }

      const data = msg.payload + (newline ? "\n" : "");
      const writeMethod = appendToFile ? fs.appendFile : fs.writeFile;
      await writeMethod(filePath, data);

      log.info(`Msg ${appendToFile ? "appended" : "written"} to ${filePath}`);
    } catch (error) {
      log.error(`Failed to write message: ${error.message}`);
    }
    return msg;
  };

  return createNode({ type: "writeToFileNode", name, process });
};
