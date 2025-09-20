import { createNode, type ProcessFn } from "../lib/create-node.ts";
//@ts-ignore
import * as ejs from "ejs";

export const createTemplateNode = ({
  name,
  template = "test template <%= msg.payload %>",
}: {
  name: string;
  template: string;
}) => {
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

  return createNode({ type: "templateNode", name, process });
};
