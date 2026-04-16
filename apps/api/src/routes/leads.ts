import type { FastifyInstance } from 'fastify';
import type { CreateLeadInput } from '@reaa/shared';
import { createLead } from '../modules/leads/service.js';
import { assertObject, optionalBoolean, optionalNumber, optionalString, requireString } from '../lib/validators.js';

export async function leadRoutes(app: FastifyInstance) {
  app.post('/leads', async (request, reply) => {
    try {
      const body = assertObject(request.body) as Record<string, unknown>;
      const payload: CreateLeadInput = {
        orgId: requireString(body.orgId, 'orgId'),
        propertyId: optionalNumber(body.propertyId),
        sessionId: optionalString(body.sessionId),
        customerId: optionalString(body.customerId),
        contactName: optionalString(body.contactName),
        contactEmail: optionalString(body.contactEmail),
        contactPhone: optionalString(body.contactPhone),
        message: optionalString(body.message),
        source: optionalString(body.source),
        channel: optionalString(body.channel) as CreateLeadInput['channel'],
        leadType: optionalString(body.leadType) as CreateLeadInput['leadType'],
        conversationSummary: optionalString(body.conversationSummary),
        leadScore: optionalNumber(body.leadScore),
        leadTemperature: optionalString(body.leadTemperature) as CreateLeadInput['leadTemperature'],
        humanHandoffRequested: optionalBoolean(body.humanHandoffRequested),
        operationType: optionalString(body.operationType),
        propertyType: optionalString(body.propertyType),
        zone: optionalString(body.zone),
        budgetMin: optionalNumber(body.budgetMin),
        budgetMax: optionalNumber(body.budgetMax),
        currency: optionalString(body.currency),
        bedrooms: optionalNumber(body.bedrooms),
        urgency: optionalString(body.urgency),
      };

      return createLead(payload);
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });
}
