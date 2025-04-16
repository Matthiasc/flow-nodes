import { Logger } from '../../lib/create-logger.js';
import { Node, Msg } from '../../lib/create-node.js';
import '../../lib/create-globals.js';

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

export { createRateLimitingNode };
