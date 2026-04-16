import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return {
    ok: true,
    service: 'real-estate-ai-addon-api',
    timestamp: new Date().toISOString(),
  };
});

app.get('/webhooks/meta', async () => {
  return { ok: true, message: 'meta webhook verification placeholder' };
});

app.post('/webhooks/meta', async (request) => {
  return { ok: true, received: true, body: request.body };
});

app.post('/webchat/session', async () => {
  return { ok: true, message: 'webchat session placeholder' };
});

app.post('/webchat/message', async (request) => {
  return { ok: true, message: 'webchat message placeholder', body: request.body };
});

app.post('/properties/search', async (request) => {
  return { ok: true, message: 'property search placeholder', body: request.body };
});

app.post('/leads', async (request) => {
  return { ok: true, message: 'lead creation placeholder', body: request.body };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
