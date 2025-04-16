import { createNode } from "../lib/create-node.js";

export const createRandomNumberNode = ({
  name,
  wholeNumber = false,
  range = [0, 1],
}) => {
  const process = async ({ msg, log, globals }) => {
    // console.log(Math.random())

    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];

    msg.payload = randomNumber;

    if (wholeNumber) msg.payload = Math.floor(randomNumber);
    console.log("pl", msg.payload);

    return msg;
  };
  return createNode({ type: "debuggerNode", name, process });
};
