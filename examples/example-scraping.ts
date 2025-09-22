import { createDebuggerNode, createHtmlSelectorNode, createHttpRequestNode, createRateLimitingNode, createWriteFileNode, createFunctionNode } from "../src";

const scrapeNode = createHttpRequestNode("scraper", {
    url: "https://news.ycombinator.com"
});

const extractNode = createHtmlSelectorNode("extractor", {
    selector: ".titleline > a",
    attribute: "href" // Extract the href attribute
});

// Transform the extracted links into proper JSON structure
const formatNode = createFunctionNode("formatter", {
    func: async ({ msg, log }) => {
        log.info("Formatting extracted links for JSON output");

        const links = Array.isArray(msg.payload) ? msg.payload : [msg.payload];
        const formattedData = {
            timestamp: new Date().toISOString(),
            source: "Hacker News",
            totalLinks: links.length,
            links: links.map((link: any, index: number) => ({
                id: index + 1,
                url: link,
                extractedAt: new Date().toISOString()
            }))
        };

        // Return the full message with JSON string as payload
        return {
            ...msg,
            payload: JSON.stringify(formattedData, null, 2)
        };
    }
});

const saveNode = createWriteFileNode("saver", {
    filePath: "./scraped-links.json",
    appendToFile: false, // Overwrite the file each time
    newline: false // Don't add extra newline since JSON is already formatted
});

// Rate-limited scraping
const rateLimitNode = createRateLimitingNode("limiter", {
    limit: 1,
    interval: 1000 // 1 request per second
});

const debuggerNode = createDebuggerNode("debugger");

// Build pipeline - now much simpler!
scrapeNode
    .to(rateLimitNode)
    .to(extractNode)
    .to(formatNode)
    .to(saveNode)
    .to(debuggerNode);

scrapeNode.process({ msg: {} }); // Start the flow with an empty message