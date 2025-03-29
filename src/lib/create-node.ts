import { createGlobals } from "./create-globals.ts";
import { createLogger, type Logger } from "./create-logger.ts";

type CreateNode = {
  type: string;
  name: string;
  process: Function;
  onProcessed?: Function;
};

type Node = any;
type Msg = {};

// type Process = (args: { msg: Msg; log: Logger; globals: any }) => Promise<Msg>;

export const createNode = ({
  type,
  name,
  process,
  onProcessed,
}: CreateNode) => {
  if (!name) throw new Error("Node name is required");
  if (!process) throw new Error("Node process function is required");
  if (typeof process !== "function")
    throw new Error("Node process function must be a function");
  if (!type) throw new Error("Node type is required");

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
    log,
    globals,
  }: {
    msg: Msg;
    log?: Logger;
    globals?: any;
  }) => {
    if (!log) log = createLogger(name);
    if (!msg) msg = {};
    if (!globals) globals = createGlobals();

    const msgProcessed = await process({ msg, log, globals });

    if (!msgProcessed)
      return log.error(`node ${name} failed to process stopping flow`);

    onProcessed && onProcessed({ msg: structuredClone(msgProcessed), log });

    connectedTo.forEach((n) =>
      n.process({ msg: structuredClone(msgProcessed), log, globals })
    );
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
  };
};
