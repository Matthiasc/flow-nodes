import { type Globals } from "../../lib/create-globals.js";
import { type Logger } from "../../lib/create-logger.js";
import { createNode, type Msg } from "../../lib/create-node.js";

export const createBatchNode = ({ name, numberOfMessages = 5 }) => {
  const messages: Msg[] = [];

  const process = async ({
    msg,
    log,
    globals,
  }: {
    msg: Msg;
    log: Logger;
    globals: Globals;
  }) => {
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

  return createNode({ type: "delayNode", name, process });
};
