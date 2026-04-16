import type { FastifyInstance } from 'fastify';
import { runDueFollowUps } from '../modules/followup/service.js';

export async function followUpRoutes(app: FastifyInstance) {
  app.post('/internal/followups/run', async () => {
    const processed = await runDueFollowUps();
    return {
      ok: true,
      processed,
      count: processed.length,
    };
  });
}
