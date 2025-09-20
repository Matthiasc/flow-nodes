import { createNode, type ProcessFn, type NodeCreationFn } from "../../lib/create-node.ts";

export type DelayNodeProps = {
  delay?: number;
};

export const createDelayNode: NodeCreationFn<DelayNodeProps> = (name, props = {}) => {
  const { delay = 1000 } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    // msg.payload = payload;
    return msg;
  };

  return createNode({
    type: "delayNode",
    name,
    process,
    properties: { delay }
  });
};
