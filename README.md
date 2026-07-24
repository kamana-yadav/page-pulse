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
## 🛠️ Design Decisions & Trade-offs

1. **Lightweight HTML Parsing over Full Headless Browser**:
   * *Reasoning*: Used lightweight server-side DOM parsing instead of Puppeteer/Playwright to ensure low latency, minimal memory usage, and instant response times on free-tier hosting (Render).

2. **Server-Side Audit Execution**:
   * *Reasoning*: Handled URL fetching and parsing on the backend API endpoint (`/api/audit`) to prevent CORS issues on client-side requests and properly parse raw response headers and HTML metadata.

3. **Graceful Error Handling & Fallbacks**:
   * *Reasoning*: Implemented custom error responses for invalid URLs, timeouts, and non-HTML content to ensure the frontend never crashes and always displays clean feedback to the user.
