import { createNode, type ProcessFn } from "../../lib/create-node.ts";

export const createDelayNode = ({ name, delay = 1000 }: { name: string; delay?: number }) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    // msg.payload = payload;
    return msg;
  };

  return createNode({ type: "delayNode", name, process });
};
