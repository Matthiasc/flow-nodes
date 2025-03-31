import * as cheerio from "cheerio";
import { createNode, type ProcessFn } from "../lib/create-node.ts";

export const createHtmlSelectorNode = ({ name, selector }) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    if (typeof msg.payload !== "string") {
      throw new Error("Input is not a string, unable to parse HTML.");
    }

    //@ts-ignore
    const _selector = selector || msg.selector;

    try {
      const $ = cheerio.load(msg.payload);
      const elements = $(_selector)
        .map((i, el) => $(el).text().trim())
        .get();

      if (!elements) {
        msg.payload = null;
        return msg; // If no element found, return empty string
      }

      log.info(`Selected ${elements.length} elements`);
      msg.payload = elements;

      return msg;
    } catch (error) {
      throw new Error(`Error parsing HTML: ${error}`);
    }
  };
  return createNode({ type: "selectorNode", name, process });
};
