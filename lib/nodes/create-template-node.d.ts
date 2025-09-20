import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type TemplateNodeProps = {
    template?: string;
};
declare const createTemplateNode: NodeCreationFn<TemplateNodeProps>;

export { type TemplateNodeProps, createTemplateNode };
