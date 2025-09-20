import { createNode, type ProcessFn, type NodeCreationFn } from "../../lib/create-node.ts";

export type RateLimitingNodeProps = {
  limit?: number;
  interval?: number;
};

/**
 *
 * Will drop messages when the rate limit is exceeded.
 */
export const createRateLimitingNode: NodeCreationFn<RateLimitingNodeProps> = (name, props = {}) => {
  const { limit = 1, interval = 1000 } = props;
  let calls = 0;
  let lastReset = Date.now();

  const process: ProcessFn = async ({ msg, log, globals }) => {
    const now = Date.now();

    // Reset the count after the interval has passed
    if (now - lastReset >= interval) {
      calls = 0;
      lastReset = now;
    }

    // If we haven't exceeded the limit, invoke the function
    if (calls < limit) {
      calls++;
      return msg;
    } else {
      log.info("Rate limit exceeded, dropping message");
      return null;
    }
  };

  return createNode({
    type: "rateLimitingNode",
    name,
    process,
    properties: { limit, interval }
  });
};
