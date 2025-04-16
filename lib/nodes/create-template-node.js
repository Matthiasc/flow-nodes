import { __name } from '../chunk-SHUYVCID.js';
import { createNode } from '../lib/create-node.js';
import * as ejs from 'ejs';

const createTemplateNode = /* @__PURE__ */ __name(({
  name,
  template = "test template <%= msg.payload %>"
}) => {
  const process = /* @__PURE__ */ __name(async ({
    msg,
    log,
    globals
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
  }, "process");
  return createNode({ type: "delayNode", name, process });
}, "createTemplateNode");

export { createTemplateNode };
