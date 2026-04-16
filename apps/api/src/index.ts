import Fastify from 'fastify';
import { config } from './lib/config.js';
import { healthRoutes } from './routes/health.js';
import { metaRoutes } from './routes/meta.js';
import { webchatRoutes } from './routes/webchat.js';
import { propertyRoutes } from './routes/properties.js';
import { leadRoutes } from './routes/leads.js';

const app = Fastify({ logger: true });

await healthRoutes(app);
await metaRoutes(app);
await webchatRoutes(app);
await propertyRoutes(app);
await leadRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
