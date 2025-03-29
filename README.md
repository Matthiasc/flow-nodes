# flow-nodes

Experimental / tryout of a flow-based programming with nodes. It lays somewhere between functional programming and node based flows such as NODE-RED. (but then without the graphical interface)

The idea is to create a set of nodes that can be connected to each other to create a flow.
A node can be linked to one or more nodes. And one or more nodes can be linked to one node.
You could create a flow that does something like this:

```js
const nFetch = createHttpRequestNode({
  name: "fetchNode1",
  url: "https://example.com",
});
const nHtmlSelector = createHtmlSelectorNode({
  name: "selectorNode1",
  selector: "h2",
});
const nDebugger = createDebuggerNode({ name: "debuggerNode1" });

nFetch.to(nHtmlSelector).to(nDebugger);
```

This would create a flow that fetches the content of `https://example.com` and then selects all first `h2` elements from the response and logs it to the console.
