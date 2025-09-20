import { createNode, type ProcessFn, type NodeCreationFn } from "../lib/create-node.ts";
//@ts-ignore
import * as ejs from "ejs";

export type TemplateNodeProps = {
  template?: string;
};

export const createTemplateNode: NodeCreationFn<TemplateNodeProps> = (name, props = {}) => {
  const { template = "test template <%= msg.payload %>" } = props;
  const process: ProcessFn = async ({ msg, log, globals }) => {
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
