import { createNode, ProcessFn } from "../../lib/create-node.ts";

export const createPassThroughNode = ({ name }: { name: string }) => {
  let count = 0;
  const process: ProcessFn = async ({ msg, log, globals }) => {
    count++;
    return msg;
  };
  return createNode({ type: "passThroughNode", name, process });
};
