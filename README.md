# flow-nodes

Experimental / tryout of a flow-based programming with nodes. It lays somewhere between functional programming and node based flows such as NODE-RED. (but then without the graphical interface)

The idea is to create a set of nodes that can be connected to each other to create a flow.
A node can be linked to one or more nodes. And one or more nodes can be linked to one node.
You could create a flow that does something like this:

## example

This would create a flow that fetches the content of `https://example.com` and then selects all `h2` elements from the response and logs it to the console.

```js
//create the nodes

const nFetch = createHttpRequestNode({
  name: "fetchNode1",
  url: "https://example.com",
});
const nHtmlSelector = createHtmlSelectorNode({
  name: "selectorNode1",
  selector: "h2",
});
const nDebugger = createDebuggerNode({ name: "debuggerNode1" });

// connect the nodes

nFetch.to(nHtmlSelector).to(nDebugger);
```

## connecting nodes

```js
// you can connect one node to multiple nodes
node1.to([node2, node3]);

// you can connect multiple nodes to one node
node1.to(node2);
node1.to(node3);

// connect node in a loop
// (be careful, incorporate flow altering / limiting nodes)

node1.to(node2);
node2.to(node3);
node3.to(node1);
```
