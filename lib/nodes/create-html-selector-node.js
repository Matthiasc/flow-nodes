import { __name } from '../chunk-SHUYVCID.js';
import * as cheerio from 'cheerio';
import { createNode } from '../lib/create-node.js';

const createHtmlSelectorNode = /* @__PURE__ */ __name(({ name, selector }) => {
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    if (typeof msg.payload !== "string") {
      throw new Error("Input is not a string, unable to parse HTML.");
    }
    const _selector = selector || msg.selector;
    try {
      const $ = cheerio.load(msg.payload);
      const elements = $(_selector).map((i, el) => $(el).text().trim()).get();
      if (!elements) {
        msg.payload = null;
        return msg;
      }
      log.info(`Selected ${elements.length} elements`);
      msg.payload = elements;
      return msg;
    } catch (error) {
      throw new Error(`Error parsing HTML: ${error}`);
    }
  }, "process");
  return createNode({ type: "selectorNode", name, process });
}, "createHtmlSelectorNode");

export { createHtmlSelectorNode };
