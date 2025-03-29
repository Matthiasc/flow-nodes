import { L as Logger } from '../create-logger-CYNC0QVN.js';

declare const createHtmlSelectorNode: ({ name, selector }: {
    name: any;
    selector: any;
}) => {
    name: string;
    type: string;
    to: (node: any) => any;
    children: () => any[];
    nodeTree: () => {
        node: any;
        children?: any[];
    }[];
    process: ({ msg, log, globals, }: {
        msg: {};
        log?: Logger;
        globals?: any;
    }) => Promise<void>;
};

export { createHtmlSelectorNode };
