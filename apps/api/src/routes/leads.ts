import type { FastifyInstance } from 'fastify';
import type { CreateLeadInput } from '@reaa/shared';
import { createLead } from '../modules/leads/service.js';

export async function leadRoutes(app: FastifyInstance) {
  app.post('/leads', async (request) => {
    const body = (request.body as CreateLeadInput) ?? ({ orgId: '' } as CreateLeadInput);
    return createLead(body);
  });
}
