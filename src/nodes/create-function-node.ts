import { createNode, type ProcessFn, type NodeFactory } from "../lib/create-node.ts";

interface FunctionNodeProps {
  func: ProcessFn;
}

export const createFunctionNode: NodeFactory<FunctionNodeProps> = (name, props) => {
  if (!props || !props.func) {
    throw new Error('Function node requires a func property');
  }

  const { func } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    if (typeof func !== "function") {
      throw new Error("Function is missing");
    }
    msg.payload = await func({ msg, log, globals });
    return msg;
  };
  return createNode({ type: "functionNode", name, process });
};
createFunctionNode.nodeType = "functionNode";
