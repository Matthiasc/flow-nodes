import { N as Node, M as Msg, L as Logger } from './create-node-BNJMA075.js';
export { b as createGlobals, a as createLogger, c as createNode } from './create-node-BNJMA075.js';
export { createDebuggerNode } from './nodes/create-debugger-node.js';
export { createFunctionNode } from './nodes/create-function-node.js';
export { createHtmlSelectorNode } from './nodes/create-html-selector-node.js';
export { createHttpRequestNode } from './nodes/create-http-request-node.js';
export { createRandomNumberNode } from './nodes/create-random-number-node.js';
export { createSendSimpleMailNode } from './nodes/create-send-simple-mail-node.js';
export { createTemplateNode } from './nodes/create-template-node.js';

declare const createBatchNode: ({ name, numberOfMessages }: {
    name: any;
    numberOfMessages?: number;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

declare const createDelayNode: ({ name, delay }: {
    name: any;
    delay?: number;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

declare const createPassThroughNode: ({ name }: {
    name: any;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

/**
 *
 * Will drop messages when the rate limit is exceeded.
 */
declare const createRateLimitingNode: ({ name, limit, interval, }: {
    name: string;
    limit?: number;
    interval?: number;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

declare const createReadFileNode: ({ name, filePath, encoding, }: {
    name: string;
    filePath?: string;
    encoding?: BufferEncoding;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

declare const createWriteFileNode: ({ name, filePath, createDir, appendToFile, newline, }: {
    name: any;
    filePath: any;
    createDir?: boolean;
    appendToFile?: boolean;
    newline?: boolean;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

declare const createWatchFileNode: ({ name, filePath }: {
    name: any;
    filePath: any;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

export { createBatchNode, createDelayNode, createPassThroughNode, createRateLimitingNode, createReadFileNode, createWatchFileNode, createWriteFileNode };
