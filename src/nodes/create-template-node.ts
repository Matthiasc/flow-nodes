import { type Globals } from "../lib/create-globals.js";
import { type Logger } from "../lib/create-logger.js";
import { createNode, type Msg } from "../lib/create-node.js";
import * as ejs from "ejs";

export const createTemplateNode = ({
  name,
  template = "test template <%= msg.payload %>",
}: {
  name: string;
  template: string;
}) => {
  const process = async ({
    msg,
    log,
    globals,
  }: {
    msg: Msg;
    log: Logger;
    globals: Globals;
  }) => {
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

  return createNode({ type: "delayNode", name, process });
};
