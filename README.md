# Flow-Nodes 

An experiment that sits between node based editors and functional programming. 

### Installation

```bash
npm install @matthiasc/flow-nodes
```

### Basic Example

```typescript
import { createHttpRequestNode, createHtmlSelectorNode, createDebuggerNode } from '@matthiasc/flow-nodes';

// Create nodes
const httpNode = createHttpRequestNode("fetcher", {
  url: "https://example.com"
});

const selectorNode = createHtmlSelectorNode("selector", {
  selector: "h2"
});

const debugNode = createDebuggerNode("logger");

// Connect the flow
httpNode.to(selectorNode).to(debugNode);

// Execute
httpNode.process({ msg: { payload: {} } });
```

## Core Concepts

### Node Types

**Regular Nodes** - Process data when they receive a message:
```typescript
const delayNode = createDelayNode("delay", { delay: 1000 });
const templateNode = createTemplateNode("template", { template: "Hello {{name}}!" });
```

**Trigger Nodes** - Start flows automatically:
```typescript
const cronNode = createCronNode("scheduler", { 
  cronTime: "0 */5 * * * *" // Every 5 minutes
});

const fileWatcher = createWatchFileNode("watcher", {
  filePath: "./data.txt"
});

// Start triggers
cronNode.start();
fileWatcher.start();
```

### Environment Variables

Securely inject credentials and configuration:

```typescript
// Set environment variables
process.env.SMTP_USER = "user@gmail.com";
process.env.SMTP_PASS = "app-password";

const emailNode = createSendSimpleMailNode("mailer", {
  smtpConfig: {
    service: "gmail",
    auth: {
      user: "{{SMTP_USER}}", // Injected at runtime
      pass: "{{SMTP_PASS}}"  // Templates preserved in serialization
    }
  },
  mailOptions: {
    from: "{{SMTP_USER}}",
    to: "recipient@example.com",
    subject: "Automated Report",
    message: "Your daily report is ready!"
  }
});
```

### Flow Serialization

Save and restore entire workflows:

```typescript
import { serializeFlow, deserializeFlow } from '@matthiasc/flow-nodes';

// Create a flow
const cronNode = createCronNode("daily-report", { cronTime: "0 9 * * *" });
const emailNode = createSendSimpleMailNode("notify", { /* config */ });
cronNode.to(emailNode);

// Serialize to JSON
const flowJson = serializeFlow([cronNode]);
console.log(JSON.stringify(flowJson, null, 2));

// Later: deserialize and run
const restoredFlow = deserializeFlow(flowJson);
restoredFlow.startFlow(); // Starts all trigger nodes
```
## Advanced Examples

### Automated Email Reports

```typescript
import { config } from 'dotenv';
config(); // Load .env file

const cronNode = createCronNode("daily-report", {
  cronTime: "0 9 * * *" // 9 AM daily
});

const dataNode = createReadFileNode("data-reader", {
  filePath: "./daily-stats.json"
});

const templateNode = createTemplateNode("email-template", {
  template: `
    <h1>Daily Report</h1>
    <p>Date: <%= new Date().toDateString() %></p>
    <p>Stats: <%= JSON.stringify(msg.payload) %></p>
  `
});

const emailNode = createSendSimpleMailNode("emailer", {
  smtpConfig: {
    service: "gmail",
    auth: {
      user: "{{GMAIL_USER}}",
      pass: "{{GMAIL_APP_PASSWORD}}"
    }
  },
  mailOptions: {
    from: "{{GMAIL_USER}}",
    to: "manager@company.com",
    subject: "Daily Report - <%= new Date().toDateString() %>",
    messageType: "html"
  }
});

// Build the flow
cronNode.to(dataNode).to(templateNode).to(emailNode);

// Start the scheduler
cronNode.start();
```

### Web "Scraping"

```typescript
const scrapeNode = createHttpRequestNode("scraper", {
  url: "https://news.ycombinator.com"
});

const extractNode = createHtmlSelectorNode("extractor", {
  selector: ".titleline > a",
  attribute: "href"
});
const saveNode = createWriteFileNode("saver", {
  filePath: "./scraped-links.json"
});

// Rate-limited scraping
const rateLimitNode = createRateLimitingNode("limiter", {
  limit: 1,
  interval: 5000 // 1 request per 5 seconds
});

// Build pipeline
scrapeNode
  .to(rateLimitNode)
  .to(extractNode)
  .to(saveNode);

scrapeNode.process({ });
```


## Flow Control API

```typescript
const flow = deserializeFlow(flowJson);

// Flow-wide controls
flow.startFlow();  // Start all trigger nodes
flow.stopFlow();   // Stop all trigger nodes

// Access nodes
const node = flow.getNode("my-node");
const allNodes = flow.allNodes;
const triggers = flow.triggerNodes;
```

## Node Connection Patterns

```typescript
// Linear chain
node1.to(node2).to(node3);

// One-to-many (fan-out)
node1.to([node2, node3, node4]);

// Many-to-one (fan-in)
node1.to(targetNode);
node2.to(targetNode);
node3.to(targetNode);

// Complex branching
cronNode
  .to(dataNode)
  .to([processor1, processor2])

processor1.to(emailNode);
processor2.to(fileNode);

// Loops (use rate limiting!)
node1.to(node2);
node2.to(node3);
node3.to(node1); // Creates a cycle
```

## Custom Node Development

```typescript
import { createNode, type ProcessFn, type NodeFactory } from '@matthiasc/flow-nodes';

type MyNodeProps = {
  customParam: string;
};

export const createMyCustomNode: NodeFactory<MyNodeProps> = (name, props) => {
  const process: ProcessFn = async ({ msg, log, globals }) => {
    log.info(`Processing in ${name}`);
    
    // Your custom logic here
    return {
      ...msg,
      payload: {
        ...msg.payload,
        processed: true
      }
    };
  };

  return createNode({
    type: "myCustomNode",
    name,
    process,
    properties: props
  });
};

// Don't forget to set the nodeType for serialization
createMyCustomNode.nodeType = "myCustomNode";
```


---

