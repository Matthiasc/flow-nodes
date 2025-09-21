import { createNode, type ProcessFn, type TriggerNodeCreationFn, type TriggerNode } from "../../lib/create-node.ts";
import chokidar from "chokidar";
import { stat } from "fs/promises";
import path from "path";

interface WatchFileNodeProps {
  filePath: string;
}

export const createWatchFileNode: TriggerNodeCreationFn<WatchFileNodeProps> = (name, props) => {
  if (!props || !props.filePath) {
    throw new Error('Watch file node requires filePath property');
  }

  const { filePath } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => msg; //just pass the message through

  const n = createNode({
    type: "watchFileNode",
    name,
    process,
    properties: { filePath }
  });

  let watcher: any = null;
  let isWatching = false;

  function start() {
    if (!isWatching) {
      watcher = chokidar.watch(filePath, {
        persistent: true,
        ignoreInitial: true,
      });

      watcher
        .on("all", async (eventType: string, fileName: string) => {
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
        .on("error", (error: any) => {
          n.log.error(`Watcher error: ${error}`);
        });

      isWatching = true;
    }
  }

  function stop() {
    if (isWatching && watcher) {
      watcher.close();
      watcher = null;
      isWatching = false;
    }
  }

  // All triggers start stopped - use flow control to start
  // start() must be called explicitly

  return { ...n, start, stop, isRunning: () => isWatching } as TriggerNode;
};
