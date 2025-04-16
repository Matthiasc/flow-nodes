import { prettyPrint } from "../lib/create-logger.js";
import { createNode, type ProcessFn } from "../lib/create-node.js";

export const createDebuggerNode = ({ name }) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    msg.log && console.log("log", prettyPrint(msg.log));
    console.log("msg", msg?.payload);
    return msg;
  };
  return createNode({ type: "debuggerNode", name, process });
};
