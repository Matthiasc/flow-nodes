import { createNode } from "../lib/create-node.ts";

export const createDebuggerNode = ({ name }) => {
  const process = async ({ msg, log, globals }) => {
    console.log("log", log.getLogNiceOutput());
    console.log("msg", msg);
    return msg;
  };
  return createNode({ type: "debuggerNode", name, process });
};
