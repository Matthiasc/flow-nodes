import { createNode, type ProcessFn, type TriggerNodeFactory, type TriggerNode } from "../../lib/create-node.ts";
import chokidar from "chokidar";
import { stat } from "fs/promises";
import path from "path";

interface WatchFileNodeProps {
  filePath: string;
}

export const createWatchFileNode: TriggerNodeFactory<WatchFileNodeProps> = (name, props) => {
  if (!props || !props.filePath) {
    throw new Error('Watch file node requires filePath property');
  }

  const { filePath } = props;
  let watcher: any = null;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    return msg;
  };

  const node = createNode({
    type: "watchFile",
    name,
    process,
    properties: { filePath }
  });

  const start = () => {
    if (watcher) return;

    watcher = chokidar.watch(filePath, {
      persistent: true
    });

    watcher.on('change', (changedPath: string) => {
      console.log(`File ${changedPath} changed`);
      node.process({
        msg: {
          payload: {
            eventType: 'change',
            filename: path.basename(changedPath),
            filePath: changedPath,
            timestamp: Date.now()
          }
        }
      });
    });
  };

  const stop = () => {
    if (watcher) {
      watcher.close();
      watcher = null;
    }
  };

  const isRunning = () => {
    return watcher !== null;
  };

  return { ...node, start, stop, isRunning };
};
createWatchFileNode.nodeType = "watchFile";
