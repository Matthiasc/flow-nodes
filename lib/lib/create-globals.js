import { __name } from '../chunk-SHUYVCID.js';

const createGlobals = /* @__PURE__ */ __name(() => {
  const globals = {};
  return {
    set: /* @__PURE__ */ __name((key, value) => {
      globals[key] = value;
    }, "set"),
    get: /* @__PURE__ */ __name((key) => {
      return globals[key];
    }, "get")
  };
}, "createGlobals");

export { createGlobals };
