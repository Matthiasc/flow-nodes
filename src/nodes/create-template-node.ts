import { createNode, type ProcessFn, type NodeFactory } from "../lib/create-node.ts";
//@ts-ignore
import * as ejs from "ejs";

export type TemplateNodeProps = {
  template?: string;
};

export const createTemplateNode: NodeFactory<TemplateNodeProps> = (name, props = {}) => {
  let { template = "test template <%= msg.payload %>" } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {

    template = msg.template || template;

    try {
      msg.payload = await ejs.render(
        template,
        { msg, globals },
        { async: true }
      );
    } catch (error) {
      throw new Error(`Error rendering template: ${error}`);
    }

    return msg;
  };

  return createNode({
    type: "templateNode",
    name,
    process,
    properties: { template }
  });
};
createTemplateNode.nodeType = "templateNode";
