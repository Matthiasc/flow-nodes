import { describe, it, expect } from 'vitest';
import { createDelayNode } from './create-delay-node.ts';

describe("createDelayNode", () => {
  it("should delay execution by the specified time", async () => {
    const delayTime = 1e3;
    const delayNode = createDelayNode({ name: "test", delay: delayTime });
    const start = Date.now();
    await delayNode.process({ msg: { payload: "test" } });
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(delayTime);
  });
});
