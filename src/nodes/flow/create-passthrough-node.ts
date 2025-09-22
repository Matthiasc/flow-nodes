import { createNode, type ProcessFn, type NodeFactory } from "../../lib/create-node.ts";

export type PassThroughNodeProps = {};

export const createPassThroughNode: NodeFactory<PassThroughNodeProps> = (name, props = {}) => {
  let count = 0;
  const process: ProcessFn = async ({ msg, log, globals }) => {
    count++;
    return msg;
  };
  return createNode({
    type: "passThrough",
    name,
    process,
    properties: {}
  });
};
createPassThroughNode.nodeType = "passThrough";
