import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type HtmlSelectorNodeProps = {
    selector: string;
};
declare const createHtmlSelectorNode: NodeCreationFn<HtmlSelectorNodeProps>;

export { type HtmlSelectorNodeProps, createHtmlSelectorNode };
