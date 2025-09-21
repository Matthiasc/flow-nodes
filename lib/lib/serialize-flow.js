import { __name } from '../chunk-SHUYVCID.js';
import { createBatchNode } from '../nodes/flow/create-batch-node.ts';
import { createDelayNode } from '../nodes/flow/create-delay-node.ts';
import { createPassThroughNode } from '../nodes/flow/create-passthrough-node.ts';
import { createRateLimitingNode } from '../nodes/flow/create-rate-limiting-node.ts';
import { createReadFileNode } from '../nodes/storage/create-read-file-node.ts';
import { createWriteFileNode } from '../nodes/storage/create-write-file-node.ts';
import { createWatchFileNode } from '../nodes/storage/create-watch-file-node.ts';
import { createDebuggerNode } from '../nodes/create-debugger-node.ts';
import { createFunctionNode } from '../nodes/create-function-node.ts';
import { createHtmlSelectorNode } from '../nodes/create-html-selector-node.ts';
import { createHttpRequestNode } from '../nodes/create-http-request-node.ts';
import { createRandomNumberNode } from '../nodes/create-random-number-node.ts';
import { createSendSimpleMailNode } from '../nodes/create-send-simple-mail-node.ts';
import { createTemplateNode } from '../nodes/create-template-node.ts';
import { createCronNode } from '../nodes/create-cron-node.ts';

const serializeFlow = /* @__PURE__ */ __name((startNode) => {
  const visitedNodes = /* @__PURE__ */ new Set();
  const serializedNodes = [];
  const extractNodeProperties = /* @__PURE__ */ __name((node) => {
    return structuredClone(node.properties || {});
  }, "extractNodeProperties");
  const traverseNode = /* @__PURE__ */ __name((node) => {
    if (!node || visitedNodes.has(node.name)) {
      return;
    }
    visitedNodes.add(node.name);
    const connectedChildren = node.children();
    const connections = connectedChildren.map((child) => child.name);
    const properties = extractNodeProperties(node);
    const serializedNode = {
      id: node.name,
      name: node.name,
      type: node.type,
      properties,
      connections
    };
    serializedNodes.push(serializedNode);
    connectedChildren.forEach((child) => {
      traverseNode(child);
    });
  }, "traverseNode");
  traverseNode(startNode);
  return {
    nodes: serializedNodes,
    startNode: startNode.name
  };
}, "serializeFlow");
const flowToJson = /* @__PURE__ */ __name((flow) => {
  return JSON.stringify(flow, null, 2);
}, "flowToJson");
const nodeToFlowJson = /* @__PURE__ */ __name((startNode) => {
  const serializedFlow = serializeFlow(startNode);
  return flowToJson(serializedFlow);
}, "nodeToFlowJson");
const nodeFactories = {
  "batchNode": createBatchNode,
  "delayNode": createDelayNode,
  "passThroughNode": createPassThroughNode,
  "rateLimitingNode": createRateLimitingNode,
  "readFileNode": createReadFileNode,
  "writeFileNode": createWriteFileNode,
  "watchFileNode": createWatchFileNode,
  "debuggerNode": createDebuggerNode,
  "functionNode": createFunctionNode,
  "htmlSelectorNode": createHtmlSelectorNode,
  "httpRequestNode": createHttpRequestNode,
  "randomNumberNode": createRandomNumberNode,
  "sendSimpleMailNode": createSendSimpleMailNode,
  "templateNode": createTemplateNode,
  "cronNode": createCronNode
};
const deserializeFlow = /* @__PURE__ */ __name((serializedFlow) => {
  const nodeMap = /* @__PURE__ */ new Map();
  serializedFlow.nodes.forEach((serializedNode) => {
    const factory = nodeFactories[serializedNode.type];
    if (!factory) {
      throw new Error(`Unknown node type: ${serializedNode.type}`);
    }
    const node = factory(serializedNode.name, serializedNode.properties);
    nodeMap.set(serializedNode.name, node);
  });
  serializedFlow.nodes.forEach((serializedNode) => {
    const sourceNode = nodeMap.get(serializedNode.name);
    if (!sourceNode) {
      throw new Error(`Source node not found: ${serializedNode.name}`);
    }
    serializedNode.connections.forEach((targetName) => {
      const targetNode = nodeMap.get(targetName);
      if (!targetNode) {
        throw new Error(`Target node not found: ${targetName}`);
      }
      sourceNode.to(targetNode);
    });
  });
  const startNode = nodeMap.get(serializedFlow.startNode);
  if (!startNode) {
    throw new Error(`Start node not found: ${serializedFlow.startNode}`);
  }
  return startNode;
}, "deserializeFlow");
const flowFromJson = /* @__PURE__ */ __name((jsonString) => {
  const serializedFlow = JSON.parse(jsonString);
  return deserializeFlow(serializedFlow);
}, "flowFromJson");

export { deserializeFlow, flowFromJson, flowToJson, nodeToFlowJson, serializeFlow };
