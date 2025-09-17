import { createGlobals, type Globals } from "./create-globals.ts";
import { createLogger, type LogEntry, type Logger } from "./create-logger.ts";

export type Node = any;
export type Msg = { payload?: any; log?: LogEntry[];[key: string]: any };

export type ProcessFn = ({
  msg,
  log,
  globals,
}: {
  msg: Msg;
  log: Logger;
  globals: Globals;
}) => Promise<Msg | Msg[] | null> | null;

type CreateNode = {
  type: string;
  name: string;
  process: ProcessFn;
  onProcessed?: ({ msg }: { msg: Msg }) => void;
};

// type Process = (args: { msg: Msg; log: Logger; globals: any }) => Promise<Msg>;

export const createNode = ({
  type,
  name,
  process: processFn,
  onProcessed,
}: CreateNode) => {
  if (!name) throw new Error("Node name is required");
  if (!processFn) throw new Error("Node process function is required");
  if (typeof processFn !== "function")
    throw new Error("Node process function must be a function");
  if (!type) throw new Error("Node type is required");

  const nodeLog = createLogger(name);

  const connectedTo: Node[] = [];

  const connectTo = (node: Node) => {
    //if array of nodes
    if (Array.isArray(node)) {
      node.forEach((n) => connectTo(n));
      return;
    }

    //only connect it once
    if (connectedTo.includes(node))
      return console.warn(`${node.name} already connected to ${name}`);

    connectedTo.push(node);

    return node;
  };

  const processConnected = async ({
    msg,
    globals,
  }: {
    msg: Msg;
    globals?: any;
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

    // when returning an array of messages we must invoke the messages seperatly.
    const aMsg = Array.isArray(msgProcessed) ? msgProcessed : [msgProcessed];

    aMsg.forEach((msg) => {
      // if(aMsg.length > 1) log.info(`node ${name} processed ${aMsg.length} messages`);

      onProcessed && onProcessed({ msg: structuredClone(msg) });

      connectedTo.forEach((n) =>
        n.process({ msg: structuredClone(msg), globals })
      );
    });
  };

  const nodeTree = () => {
    const result: {
      node: Node;
      children?: Node[];
    }[] = [];

    connectedTo.forEach((n) => {
      result.push({
        node: n,
        children: n.nodeTree(),
      });
    });

    return result;
  };

  return {
    name,
    type,
    to: connectTo,
    children: () => [...connectedTo],
    nodeTree,
    process: processConnected,
    log: nodeLog,
  };
};
