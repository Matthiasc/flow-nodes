import { createNode, type ProcessFn, type NodeFactory } from "../lib/create-node.ts";

export type RandomNumberNodeProps = {
  wholeNumber?: boolean;
  range?: [number, number];
};

export const createRandomNumberNode: NodeFactory<RandomNumberNodeProps> = (name, props = {}) => {
  const { wholeNumber = false, range = [0, 1] } = props;
  const process: ProcessFn = async ({ msg, log, globals }) => {

    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];

    msg.payload = randomNumber;

    if (wholeNumber) msg.payload = Math.floor(randomNumber);

    return msg;
  };
  return createNode({
    type: "randomNumberNode",
    name,
    process,
    properties: { wholeNumber, range }
  });
};
createRandomNumberNode.nodeType = "randomNumberNode";
