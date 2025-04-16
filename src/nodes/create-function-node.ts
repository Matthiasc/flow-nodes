import { createNode, type ProcessFn } from "../lib/create-node.js";

export const createFunctionNode = ({
  name,
  func,
}: {
  name: string;
  func: ProcessFn;
}) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    if (typeof func !== "function") {
      throw new Error("Function is missing");
    }
    msg.payload = await func({ msg, log, globals });
    return msg;
  };
  return createNode({ type: "functionNode", name, process });
};
