import type { FastifyInstance } from 'fastify';
import type { PropertySearchInput } from '@reaa/shared';
import { searchProperties } from '../modules/properties/service.js';
import { assertObject, optionalBoolean, optionalNumber, optionalString, requireString } from '../lib/validators.js';

export async function propertyRoutes(app: FastifyInstance) {
  app.post('/properties/search', async (request, reply) => {
    try {
      const body = assertObject(request.body) as Record<string, unknown>;
      const payload: PropertySearchInput = {
        orgId: requireString(body.orgId, 'orgId'),
        operationType: optionalString(body.operationType),
        propType: optionalString(body.propType),
        zone: optionalString(body.zone),
        budgetMin: optionalNumber(body.budgetMin),
        budgetMax: optionalNumber(body.budgetMax),
        currencyId: optionalString(body.currencyId),
        rooms: optionalNumber(body.rooms),
        bedrooms: optionalNumber(body.bedrooms),
        bathrooms: optionalNumber(body.bathrooms),
        garage: optionalBoolean(body.garage),
        mortgageEligible: optionalBoolean(body.mortgageEligible),
        limit: optionalNumber(body.limit),
      };

      const results = await searchProperties(payload);
      return {
        ok: true,
        count: results.length,
        results,
      };
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });
}
