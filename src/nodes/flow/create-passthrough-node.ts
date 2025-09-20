import { createNode, type ProcessFn, type NodeCreationFn } from "../../lib/create-node.ts";

export type PassThroughNodeProps = {};

export const createPassThroughNode: NodeCreationFn<PassThroughNodeProps> = (name, props = {}) => {
  let count = 0;
  const process: ProcessFn = async ({ msg, log, globals }) => {
    count++;
    return msg;
  };
  return createNode({
    type: "passThroughNode",
    name,
    process,
    properties: {}
  });
};
