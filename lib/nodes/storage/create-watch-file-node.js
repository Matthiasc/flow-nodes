import { __name } from '../../chunk-SHUYVCID.js';
import { createNode } from '../../lib/create-node.ts';
import chokidar from 'chokidar';
import { stat } from 'fs/promises';

const createWatchFileNode = /* @__PURE__ */ __name((name, props) => {
  if (!props || !props.filePath) {
    throw new Error("Watch file node requires filePath property");
  }
  const { filePath } = props;
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => msg, "process");
  const n = createNode({
    type: "watchFileNode",
    name,
    process
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
