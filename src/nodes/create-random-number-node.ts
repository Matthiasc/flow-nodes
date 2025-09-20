import { createNode, type ProcessFn } from "../lib/create-node.ts";

export const createRandomNumberNode = ({
  name,
  wholeNumber = false,
  range = [0, 1],
}: {
  name: string;
  wholeNumber?: boolean;
  range?: [number, number];
}) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {

    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];

    msg.payload = randomNumber;

    if (wholeNumber) msg.payload = Math.floor(randomNumber);

    return msg;
  };
  return createNode({ type: "randomNumberNode", name, process });
};
