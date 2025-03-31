import { createNode, type Msg } from "../../lib/create-node.ts";

export const createBatchNode = ({ name, numberOfMessages = 5 }) => {
  const messages: Msg[] = [];

  const process = async ({ msg, log, globals }) => {
    messages.push(msg);

    if (messages.length < numberOfMessages) {
      log.info("queueing message");
      return null;
    }

    const result = [...messages];
    messages.length = 0;
    return result;
  };

  return createNode({ type: "delayNode", name, process });
};
