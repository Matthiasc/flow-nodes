import * as cheerio from "cheerio";
import { createNode, type NodeFactory, type ProcessFn } from "../lib/create-node.ts";

export type HtmlSelectorNodeProps = {
  selector: string;
  attribute?: string; // Optional attribute to extract (e.g., 'href', 'src', 'class')
};

export const createHtmlSelectorNode: NodeFactory<HtmlSelectorNodeProps> = (name, props) => {
  if (!props || !props.selector) {
    throw new Error('HTML selector node requires a selector property');
  }

  const { selector, attribute } = props;

  const process: ProcessFn = async ({ msg, log, globals }) => {
    if (typeof msg.payload !== "string") {
      throw new Error("Input is not a string, unable to parse HTML.");
    }

    //@ts-ignore
    const _selector = selector || msg.selector;

    if (!_selector) {
      throw new Error("No CSS selector provided");
    }

    try {
      const $ = cheerio.load(msg.payload);
      const elements = $(_selector)
        .map((i, el) => {
          if (attribute) {
            // Extract the specified attribute
            return $(el).attr(attribute) || null;
          } else {
            // Extract text content (default behavior)
            return $(el).text().trim();
          }
        })
        .get()
        .filter(item => item !== null); // Remove null values

      if (!elements.length) {
        msg.payload = null;
        return msg; // If no element found, return null
      }

      log.info(`Selected ${elements.length} elements${attribute ? ` (attribute: ${attribute})` : ''}`);
      msg.payload = elements;

      return msg;
    } catch (error) {
      throw new Error(`Error parsing HTML: ${error}`);
    }
  };

  return createNode({
    type: "selector",
    name,
    process,
    properties: { selector }
  });
};
createHtmlSelectorNode.nodeType = "selector";
