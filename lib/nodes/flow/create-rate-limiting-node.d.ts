import { NodeCreationFn } from '../../lib/create-node.js';
import '../../lib/create-globals.js';
import '../../lib/create-logger.js';

type RateLimitingNodeProps = {
    limit?: number;
    interval?: number;
};
/**
 *
 * Will drop messages when the rate limit is exceeded.
 */
declare const createRateLimitingNode: NodeCreationFn<RateLimitingNodeProps>;

export { type RateLimitingNodeProps, createRateLimitingNode };
