import { type Globals } from "../lib/create-globals.ts";
import { type Logger } from "../lib/create-logger.ts";
import { createNode, type Msg } from "../lib/create-node.ts";

export const createRandomNumberNode = ({
  name,
  wholeNumber = false,
  range = [0, 1],
}: {
  name: string;
  wholeNumber?: boolean;
  range?: [number, number];
}) => {
  const process = async ({ msg, log }: {
    msg: Msg;
    log: Logger;
    globals: Globals;
  }) => {
    // console.log(Math.random())

    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];

    msg.payload = randomNumber;

    if (wholeNumber) msg.payload = Math.floor(randomNumber);

    return msg;
  };
  return createNode({ type: "debuggerNode", name, process });
};
