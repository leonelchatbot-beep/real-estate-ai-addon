import type { FastifyInstance } from 'fastify';
import type { PropertySearchInput } from '@reaa/shared';
import { searchProperties } from '../modules/properties/service.js';

export async function propertyRoutes(app: FastifyInstance) {
  app.post('/properties/search', async (request) => {
    const body = (request.body as PropertySearchInput) ?? ({ orgId: '' } as PropertySearchInput);
    const results = await searchProperties(body);
    return {
      ok: true,
      count: results.length,
      results,
    };
  });
}
