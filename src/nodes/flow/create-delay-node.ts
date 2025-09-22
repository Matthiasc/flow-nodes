import { createNode, type ProcessFn, type NodeFactory } from "../../lib/create-node.ts";

export type DelayNodeProps = {
  delay?: number;
};

export const createDelayNode: NodeFactory<DelayNodeProps> = (name, props = {}) => {
  const { delay = 1000 } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    log.info(`Delaying message for ${delay}ms`);

    await new Promise(resolve => setTimeout(resolve, delay));

    log.info(`Delay completed, forwarding message`);
    return msg;
  };

  return createNode({
    type: "delayNode",
    name,
    process,
    properties: { delay }
  });
};
createDelayNode.nodeType = "delayNode";
