import { L as Logger } from '../create-logger-CYNC0QVN.js';

declare const createRandomNumberNode: ({ name, wholeNumber, range, }: {
    name: any;
    wholeNumber?: boolean;
    range?: number[];
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
declare const createFunctionNode: ({ name, func }: {
    name: any;
    func: any;
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
declare const createRateLimitingNode: ({ name, limit, interval, }: {
    name: any;
    limit?: number;
    interval?: number;
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

export { createFunctionNode, createRandomNumberNode, createRateLimitingNode };
