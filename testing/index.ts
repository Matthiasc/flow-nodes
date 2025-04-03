/**
 * run with `node --watch src/4/index.ts`
 */

import { createHttpRequestNode } from "../src/nodes/create-http-request.ts";
import { createDebuggerNode } from "../src/nodes/create-debugger-node.ts";
import { createDelayNode } from "../src/nodes/flow/create-delay-node.ts";
import {
  createRandomNumberNode,
  createFunctionNode,
  createRateLimitingNode,
} from "../src/nodes/nodes.ts";
import { createPassThroughNode } from "../src/nodes/flow/create-passthrough-node.ts";
import { createHtmlSelectorNode } from "../src/nodes/create-html-selector-node.ts";
import { createBatchNode } from "../src/nodes/flow/create-batch-node.ts";
import { createTemplateNode } from "../src/nodes/create-template-node.ts";
import { createWriteToFileNode } from "../src/nodes/storage/create-write-to-file-node.ts";
import { createWatchFileNode } from "../src/nodes/storage/create-watch-file-node.ts";
import { createReadFileNode } from "../src/nodes/storage/create-read-file-node.ts";

/**
 * create the nodes
 */

const nDebugger = createDebuggerNode({ name: "debuggerNode1" });
const nDebugger2 = createDebuggerNode({ name: "debuggerNode2" });

const nHtmlRequest = createHttpRequestNode({
  name: "fetchNode1",
  url: "https://thuis.minck.be",
});

const nHtmlSelector = createHtmlSelectorNode({
  name: "selectorNode1",
  selector: "article h2",
});

const nRandomNumber1 = createRandomNumberNode({
  name: "randomNumberNode1",
  wholeNumber: true,
  range: [0, 10],
});
const nRandomNumber2 = createRandomNumberNode({
  name: "randomNumberNode2",
  wholeNumber: false,
  range: [0, 1],
});

const nDelay = createDelayNode({ name: "delayNode1", delay: 1000 });

const nPassThrough = createPassThroughNode({ name: "passThroughNode1" });

const nSelectRandomFromArray = createFunctionNode({
  name: "selectRandomFromArray",
  func: async (msg) => {
    if (!Array.isArray(msg.payload)) throw new Error("Input is not an array");
    const array = msg.payload;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  },
});

const nRateLimitingNode = createRateLimitingNode({
  name: "rateLimitingNode",
  limit: 1,
  interval: 2000,
});

const nBatchNode = createBatchNode({ name: "batchNode1", numberOfMessages: 5 });

const nTemplateNode = createTemplateNode({
  name: "templateNode1",
  template: `<h1>test template<h1/>
            <p><%= msg.payload %></p>`,
});

const nWriteToFile = createWriteToFileNode({
  name: "writeToFileNode1",
  filePath: "./test.txt",
});

const nWatchFile = createWatchFileNode({
  name: "watchFileNode1",
  filePath: "./test.txt",
});

const nReadFile = createReadFileNode({
  name: "readFileNode1",
  filePath: "./test.txt",
});

/**
 * links the nodes, make the flow
 */
// nFetch.to(nHtmlSelector).to([nDebugger, nDebugger2]);
nHtmlRequest
  .to(nHtmlSelector)
  .to(nSelectRandomFromArray)
  .to(nTemplateNode)
  // .to(nBatchNode)
  .to(nWriteToFile);
// .to(nDebugger);
nRateLimitingNode.to(nHtmlRequest);

nWatchFile.to(nReadFile).to(nDebugger);

// nRandomNumber.to(nDebugger);

nPassThrough.to([nRandomNumber1, nRandomNumber2]);
nRandomNumber2.to(nDebugger);
nRandomNumber1.to(nDebugger);

nRateLimitingNode.process({ msg: {} });
// /*
setInterval(() => {
  // nHtmlRequest.process({ msg: {} });
  nRateLimitingNode.process({ msg: {} });
  // console.log(nFetch.nodeTree());
}, 4000);
//*/
// nPassThrough.process({ msg: {} });
// nHtmlRequest.process({ msg: {} });
/**
 * start the flow
 */

// nFetch.process({ selector: "article h2" })
// nRandomNumber.process({})
