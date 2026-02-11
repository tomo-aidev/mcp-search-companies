# 🏢 Houjin Search MCP Server (Japan)

このMCP（Model Context Protocol）サーバーは、日本国内の約500万件の法人情報を瞬時に検索できるAIツールです。[houjin.goo.to](https://houjin.goo.to) のデータを活用し、ClaudeなどのAIが直接最新の法人番号や住所を取得することを可能にします。

## ✨ 特徴
- **膨大なデータ**: 約500万件の法人情報をMeilisearchによる高速検索で提供。
- **柔軟なクエリ**: 会社名、住所、法人番号、インボイス番号など、曖昧な指示からも検索可能。
- **SSE対応**: 安全なWeb標準（Server-Sent Events）プロトコルを採用。

## 🚀 使い方 (Claude Desktop)

`claude_desktop_config.json` の `mcpServers` セクションに以下の設定を追加してください。

```json
{
  "mcpServers": {
    "houjin-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sse-client",
        "[https://houjin.goo.to/mcp/sse](https://houjin.goo.to/mcp/sse)"
      ]
    }
  }
}

```

## 🛠 提供されるツール

### `search_companies`

キーワード（会社名、住所、法人番号等）から法人情報を検索します。

* **引数**:
* `query` (string, required): 検索キーワード（例：「株式会社大塚商会」「東京都千代田区」）
* `limit` (number, optional): 取得件数（デフォルト: 10）



## 💡 活用例

* 「株式会社大塚商会のインボイス番号を教えて」
* 「東京都千代田区にある合同会社を5件リストアップして」
* 「法人番号 1010001012983 の情報を表示して」

Powered by [houjin.goo.to](https://houjin.goo.to)

```
