import { createNode, type ProcessFn, type NodeFactory, type Msg } from "../../lib/create-node.ts";

export type BatchNodeProps = {
  numberOfMessages?: number;
};

export const createBatchNode: NodeFactory<BatchNodeProps> = (name, props = {}) => {
  const { numberOfMessages = 10 } = props;
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

  return createNode({
    type: "batchNode",
    name,
    process,
    properties: { numberOfMessages }
  });
};
