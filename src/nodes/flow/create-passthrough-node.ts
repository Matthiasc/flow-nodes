import { createNode } from "../../lib/create-node.js";

export const createPassThroughNode = ({ name }) => {
  let count = 0;
  const process = async ({ msg, log, globals }) => {
    count++;
    return msg;
  };
  return createNode({ type: "passThroughNode", name, process });
};
