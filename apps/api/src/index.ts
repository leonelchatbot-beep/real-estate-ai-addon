import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './lib/config.js';
import { healthRoutes } from './routes/health.js';
import { metaRoutes } from './routes/meta.js';
import { webchatRoutes } from './routes/webchat.js';
import { propertyRoutes } from './routes/properties.js';
import { leadRoutes } from './routes/leads.js';
import { followUpRoutes } from './routes/followup.js';
import { configRoutes } from './routes/config.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
});

await healthRoutes(app);
await metaRoutes(app);
await webchatRoutes(app);
await propertyRoutes(app);
await leadRoutes(app);
await followUpRoutes(app);
await configRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
