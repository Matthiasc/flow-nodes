import { prettyPrint } from "../lib/create-logger.ts";
import { createNode, type ProcessFn, type NodeFactory } from "../lib/create-node.ts";

export type DebuggerNodeProps = {};

export const createDebuggerNode: NodeFactory<DebuggerNodeProps> = (name, props = {}) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    msg.log && console.log("log", prettyPrint(msg.log));
    console.log("msg", msg?.payload);
    return msg;
  };
  return createNode({
    type: "debuggerNode",
    name,
    process,
    properties: {}
  });
};
createDebuggerNode.nodeType = "debuggerNode";
