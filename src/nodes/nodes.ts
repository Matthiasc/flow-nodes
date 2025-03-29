import { createNode } from "../lib/create-node.ts";

export const createRandomNumberNode = ({
  name,
  wholeNumber = false,
  range = [0, 1],
}) => {
  const process = async ({ msg, log, globals }) => {
    // console.log(Math.random())

    const r = range[1] - range[0];
    const randomNumber = Math.random() * r + range[0];
    console.log("rn", randomNumber);

    msg.payload = randomNumber;

    if (wholeNumber) msg.payload = Math.floor(randomNumber);
    console.log("pl", msg.payload);

    return msg;
  };
  return createNode({ type: "debuggerNode", name, process });
};

export const createFunctionNode = ({ name, func }) => {
  const process = async ({ msg, log, globals }) => {
    if (typeof msg.payload !== "object") {
      throw new Error("Input is not an object");
    }

    if (typeof func !== "function") {
      throw new Error("Function is missing");
    }
    msg.payload = await func(msg);
    return msg;
  };
  return createNode({ type: "functionNode", name, process });
};

export const createRateLimitingNode = ({
  name,
  limit = 1,
  interval = 1000,
}) => {
  let calls = 0;
  let lastReset = Date.now();

  const process = async ({ msg, log, globals }) => {
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
      log.warn("Rate limit exceeded, dropping message");
      return null;
    }
  };

  return createNode({ type: "rateLimitingNode", name, process });
};
