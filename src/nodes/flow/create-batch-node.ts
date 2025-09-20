import { createNode, type ProcessFn, type Msg } from "../../lib/create-node.ts";

export const createBatchNode = ({ name, numberOfMessages = 5 }: { name: string; numberOfMessages?: number }) => {
  const messages: Msg[] = [];

  const process: ProcessFn = async ({ msg, log, globals }) => {
    messages.push(msg);

    if (messages.length < numberOfMessages) {
      log.info("queueing message");
      return null;
    }

    log.info(`${messages.length} batched messages`);
    const result = [...messages];
    messages.length = 0;
    return result;
  };

  return createNode({ type: "batchNode", name, process });
};
