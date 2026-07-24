const { auditUrl } = require('../server');

describe('Page Pulse Audit Parser Unit Tests', () => {

    test('Happy Path: Successfully audits a valid HTML webpage', async () => {
        const result = await auditUrl('https://example.com');
        expect(result.status).toBe(200);
        expect(result.data).toHaveProperty('httpStatus', 200);
        expect(result.data).toHaveProperty('pageTitle');
        expect(result.data).toHaveProperty('h1Count');
        expect(typeof result.data.approximateWordCount).toBe('number');
    }, 10000);

    test('Failure Case 1: Rejects malformed or non-HTTP URL', async () => {
        const result = await auditUrl('not-a-valid-url');
        expect(result.status).toBe(400);
        expect(result.data).toHaveProperty('error');
        expect(result.data.error).toContain('Invalid URL format');
    });

    test('Failure Case 2: Handles non-HTML response gracefully', async () => {
        const result = await auditUrl('https://via.placeholder.com/150.png');
        expect(result.status).toBe(400);
        expect(result.data.error).toContain('Non-HTML content returned');
    }, 10000);

});