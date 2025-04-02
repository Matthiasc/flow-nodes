import { createNode } from "../../lib/create-node.ts";
import { watch } from "fs";
import { readFile } from "fs/promises";

export const createWatchFileNode = ({ name, filePath }) => {
  if (!filePath) throw new Error("filePath is required");

  const n = createNode({
    type: "watchFileNode",
    name,
    process: async ({ msg, log, globals }) => msg,
  });

  try {
    watch(filePath, async (eventType, filename) => {
      if (!filename) {
        n.log.warn("Filename not provided in event");
        return;
      }

      console.log(filename, eventType);

      console.log(`${filePath + " " + filename} file changed (${eventType})`);
      // n.log.info(`${filePath + " " + filename} file changed (${eventType})`);
      n.process({ msg: { payload: filePath, filename } });
    });
  } catch (error) {
    throw new Error(`Error watching file: ${error}`);
  }

  return n;
};
