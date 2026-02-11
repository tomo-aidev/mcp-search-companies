import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Meilisearch } from 'meilisearch';
import cors from "cors";

const app = express();
app.use(cors());

// Meilisearch設定（変更なし）
const client = new Meilisearch({
  host: 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'default_key',
});

const server = new Server({
  name: "houjin-search",
  version: "1.0.0",
}, {
  capabilities: { tools: {} },
});

// ツール定義（変更なし）
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "search_companies",
    description: "日本の法人情報を名称や住所から検索します。法人番号やインボイス番号での検索も可能です。",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "検索キーワード" },
        limit: { type: "number", description: "件数", default: 10 }
      },
      required: ["query"],
    },
  }],
}));

// 検索処理（変更なし）
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "search_companies") {
    throw new Error("Unknown tool");
  }
  const query = request.params.arguments.query;
  const limit = request.params.arguments.limit || 10;
  const searchResult = await client.index('companies').search(query, { limit });
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(searchResult.hits, null, 2),
    }],
  };
});

// 【重要】ここが変わります：HTTPサーバーとして待機
let transport;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});