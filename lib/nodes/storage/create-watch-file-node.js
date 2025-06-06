import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.js';
import chokidar from 'chokidar';
import { stat } from 'fs/promises';

const createWatchFileNode = /* @__PURE__ */ __name(({ name, filePath }) => {
  if (!filePath) throw new Error("filePath is required");
  const n = createNode({
    type: "watchFileNode",
    name,
    process: /* @__PURE__ */ __name(async ({ msg, log, globals }) => msg, "process")
    //just pass the message through
  });
  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true
    // awaitWriteFinish: {
    //   stabilityThreshold: 1000,
    //   pollInterval: 100,
    // },
  });
  watcher.on("all", async (eventType, fileName) => {
    if (!fileName) {
      n.log.warn("fileName not provided in event");
      return;
    }
    try {
      const fileSize = await stat(filePath);
      n.process({
        msg: {
          payload: filePath,
          fileName,
          filePath,
          fileSize,
          eventType
        }
      });
    } catch (error) {
      n.log.error(`Error handling file change: ${error}`);
    }
  }).on("error", (error) => {
    n.log.error(`Watcher error: ${error}`);
  });
  return n;
}, "createWatchFileNode");

export { createWatchFileNode };
