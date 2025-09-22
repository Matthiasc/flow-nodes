import { createNode, type ProcessFn, type NodeFactory } from "../../lib/create-node.ts";
import { promises as fs } from "fs";
import path from "path";

interface WriteFileNodeProps {
  filePath: string;
  createDir?: boolean;
  appendToFile?: boolean;
  newline?: boolean;
}

export const createWriteFileNode: NodeFactory<WriteFileNodeProps> = (name, props) => {
  if (!props || !props.filePath) {
    throw new Error('Write file node requires filePath property');
  }

  const { filePath, createDir = true, appendToFile = true, newline = true } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    try {
      if (createDir) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }

      const data = msg.payload + (newline ? "\n" : "");
      const writeMethod = appendToFile ? fs.appendFile : fs.writeFile;
      await writeMethod(filePath, data);

      log.info(`Msg ${appendToFile ? "appended" : "written"} to ${filePath}`);
    } catch (error: any) {
      log.error(`Failed to write message: ${error.message}`);
    }
    return msg;
  };

  return createNode({ type: "writeToFileNode", name, process });
};
createWriteFileNode.nodeType = "writeToFileNode";
