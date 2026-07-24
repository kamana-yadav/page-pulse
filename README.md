# ⚡ Page Pulse - Lightweight URL Audit Tool

Page Pulse is a fast web tool that accepts any public URL, audits its frontend content, and returns structured metadata including SEO and performance stats.

## 🛠️ Setup & Installation
1. Install dependencies: npm install
2. Run locally: npm start (Open http://localhost:3000)
3. Run tests: npm test

## 📑 API Contract
### Endpoint: POST /api/audit
*Request:* {"url": "https://example.com"}
*Response (200 OK):*
```json

{
  "url": "[https://example.com/](https://example.com/)",
  "httpStatus": 200,
  "responseTimeMs": "184 ms",
  "pageTitle": "Example Domain",
  "metaDescription": "No meta description found",
  "h1Count": 1,
  "imagesMissingAlt": 0,
  "approximateWordCount": 42
}
