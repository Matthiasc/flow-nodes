import { __name } from '../chunk-SHUYVCID.js';
import { CronJob } from 'cron';
import { createNode } from '../lib/create-node.ts';

const createCronNode = /* @__PURE__ */ __name((name, props = { cronTime: "* * * * * *" }) => {
  const { cronTime, autoStart = true } = props;
  const process = /* @__PURE__ */ __name(async ({ msg, log, globals }) => {
    return msg;
  }, "process");
  const node = createNode({
    type: "cronNode",
    name,
    process,
    properties: { cronTime, autoStart }
  });
  const job = CronJob.from({
    cronTime,
    onTick: /* @__PURE__ */ __name(() => {
      node.process({
        msg: {
          payload: {
            name,
            timestamp: Date.now(),
            nextDate: job.nextDate()
          }
        }
      });
    }, "onTick"),
    start: autoStart
  });
  function start() {
    if (!job.isActive) {
      job.start();
    }
  }
  __name(start, "start");
  function stop() {
    if (job.isActive) {
      job.stop();
    }
  }
  __name(stop, "stop");
  function isRunning() {
    return job.isActive;
  }
  __name(isRunning, "isRunning");
  return { ...node, start, stop, isRunning };
}, "createCronNode");

export { createCronNode };
