import type { FastifyInstance } from 'fastify';
import { getOrgBotConfig, setOrgBotConfig } from '../modules/config/store.js';
import { assertObject, optionalBoolean, optionalNumber, optionalString, requireString } from '../lib/validators.js';

export async function configRoutes(app: FastifyInstance) {
  app.get('/config/:orgId', async (request) => {
    const orgId = String((request.params as { orgId: string }).orgId);
    return {
      ok: true,
      config: getOrgBotConfig(orgId),
    };
  });

  app.post('/config/:orgId', async (request, reply) => {
    try {
      const orgId = String((request.params as { orgId: string }).orgId);
      const body = assertObject(request.body) as Record<string, unknown>;
      const current = getOrgBotConfig(orgId);

      const next = setOrgBotConfig({
        ...current,
        orgId,
        assistantName: optionalString(body.assistantName) ?? current.assistantName,
        agencyName: optionalString(body.agencyName) ?? current.agencyName,
        askPhoneBeforeLead: optionalBoolean(body.askPhoneBeforeLead) ?? current.askPhoneBeforeLead,
        followUp: {
          firstFollowUpHours: optionalNumber(body.firstFollowUpHours) ?? current.followUp.firstFollowUpHours,
          secondFollowUpHours: optionalNumber(body.secondFollowUpHours) ?? current.followUp.secondFollowUpHours,
          markDiscardedAfterSecondNoReply:
            optionalBoolean(body.markDiscardedAfterSecondNoReply) ?? current.followUp.markDiscardedAfterSecondNoReply,
        },
      });

      return {
        ok: true,
        config: next,
      };
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });
}
