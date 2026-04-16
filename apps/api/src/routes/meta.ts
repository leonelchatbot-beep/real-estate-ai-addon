import type { FastifyInstance } from 'fastify';

export async function metaRoutes(app: FastifyInstance) {
  app.get('/webhooks/meta', async () => {
    return { ok: true, message: 'meta webhook verification placeholder' };
  });

  app.post('/webhooks/meta', async (request) => {
    return { ok: true, received: true, body: request.body };
  });
}
