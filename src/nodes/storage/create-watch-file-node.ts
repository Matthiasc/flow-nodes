import { createNode, type ProcessFn, type NodeCreationFn } from "../../lib/create-node.ts";
import chokidar from "chokidar";
import { stat } from "fs/promises";
import path from "path";

interface WatchFileNodeProps {
  filePath: string;
}

export const createWatchFileNode: NodeCreationFn<WatchFileNodeProps> = (name, props) => {
  if (!props || !props.filePath) {
    throw new Error('Watch file node requires filePath property');
  }

  const { filePath } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => msg; //just pass the message through

  const n = createNode({
    type: "watchFileNode",
    name,
    process,
  });

  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true,
    // awaitWriteFinish: {
    //   stabilityThreshold: 1000,
    //   pollInterval: 100,
    // },
  });

  watcher
    .on("all", async (eventType, fileName) => {
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
            eventType,
          },
        });
      } catch (error) {
        n.log.error(`Error handling file change: ${error}`);
      }
    })
    .on("error", (error) => {
      n.log.error(`Watcher error: ${error}`);
    });

  // n.onDestroy = () => {
  //   watcher.close();
  //   n.log.info("Stopped watching file");
  // };

  return n;
};
