import { __name } from '../chunk-SHUYVCID.js';
import { createGlobals } from './create-globals.js';
import { createLogger } from './create-logger.js';

const createNode = /* @__PURE__ */ __name(({
  type,
  name,
  process: processFn,
  onProcessed
}) => {
  if (!name) throw new Error("Node name is required");
  if (!processFn) throw new Error("Node process function is required");
  if (typeof processFn !== "function")
    throw new Error("Node process function must be a function");
  if (!type) throw new Error("Node type is required");
  const nodeLog = createLogger(name);
  const connectedTo = [];
  const connectTo = /* @__PURE__ */ __name((node) => {
    if (Array.isArray(node)) {
      node.forEach((n) => connectTo(n));
      return;
    }
    if (connectedTo.includes(node))
      return console.warn(`${node.name} already connected to ${name}`);
    connectedTo.push(node);
    return node;
  }, "connectTo");
  const processConnected = /* @__PURE__ */ __name(async ({
    msg,
    globals
  }) => {
    if (!msg.log) msg.log = [];
    if (!msg) msg = {};
    if (!globals) globals = createGlobals();
    nodeLog.setMessageLog(msg.log || []);
    const msgProcessed = await processFn({ msg, log: nodeLog, globals });
    if (!msgProcessed)
      return nodeLog.info(
        `node ${name} stopped the flow by not returning a msg`
      );
    const aMsg = Array.isArray(msgProcessed) ? msgProcessed : [msgProcessed];
    aMsg.forEach((msg2) => {
      onProcessed && onProcessed({ msg: structuredClone(msg2) });
      connectedTo.forEach(
        (n) => n.process({ msg: structuredClone(msg2), globals })
      );
    });
  }, "processConnected");
  const nodeTree = /* @__PURE__ */ __name(() => {
    const result = [];
    connectedTo.forEach((n) => {
      result.push({
        node: n,
        children: n.nodeTree()
      });
    });
    return result;
  }, "nodeTree");
  return {
    name,
    type,
    to: connectTo,
    children: /* @__PURE__ */ __name(() => [...connectedTo], "children"),
    nodeTree,
    process: processConnected,
    log: nodeLog
  };
}, "createNode");

export { createNode };
