const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function auditUrl(targetUrl) {
    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.');
        }
    } catch (e) {
        return { status: 400, data: { error: 'Invalid URL format. Please provide a valid HTTP/HTTPS link.' } };
    }

    const startTime = Date.now();

    try {
        const response = await axios.get(parsedUrl.href, {
            timeout: 8000,
            maxContentLength: 5 * 1024 * 1024,
            headers: { 'User-Agent': 'PagePulse-Audit-Tool/1.0' }
        });

        const responseTimeMs = Date.now() - startTime;
        const contentType = response.headers['content-type'] || '';

        if (!contentType.includes('text/html')) {
            return {
                status: 400,
                data: { error: 'Non-HTML content returned. Page Pulse only audits web pages.' }
            };
        }

        const $ = cheerio.load(response.data);

        const pageTitle = $('title').text().trim() || 'No title found';
        const metaDescription = $('meta[name="description"]').attr('content') || 'No meta description found';
        const h1Count = $('h1').length;
        
        let missingAltCount = 0;
        $('img').each((_, img) => {
            const alt = $(img).attr('alt');
            if (!alt || alt.trim() === '') {
                missingAltCount++;
            }
        });

        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        const wordCount = bodyText ? bodyText.split(' ').length : 0;

        return {
            status: 200,
            data: {
                url: parsedUrl.href,
                httpStatus: response.status,
                responseTimeMs: responseTimeMs + ' ms',
                pageTitle: pageTitle,
                metaDescription: metaDescription,
                h1Count: h1Count,
                imagesMissingAlt: missingAltCount,
                approximateWordCount: wordCount,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            return { status: 504, data: { error: 'Request timed out after 8 seconds.' } };
        }
        if (error.response) {
            return { status: error.response.status, data: { error: 'Target server returned error status.' } };
        }
        return { status: 500, data: { error: 'Failed to reach URL: ' + error.message } };
    }
}

app.post('/api/audit', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL field is required in request body.' });
    }
    const result = await auditUrl(url);
    return res.status(result.status).json(result.data);
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log('Page Pulse server running on port ' + PORT);
    });
}

module.exports = { app, auditUrl };