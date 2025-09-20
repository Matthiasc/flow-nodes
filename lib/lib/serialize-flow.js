import { __name } from '../chunk-SHUYVCID.js';

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

export { flowToJson, nodeToFlowJson, serializeFlow };
