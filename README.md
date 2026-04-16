# real-estate-ai-addon

Add-on SaaS multi-inmobiliaria para integrar Meta DM + webchat + IA + búsqueda de propiedades + generación de leads.

## Stack
- Monorepo pnpm
- Backend: Node.js + TypeScript
- Admin: Next.js + Tailwind
- Widget: webchat embebible
- DB: PostgreSQL

## Apps
- `apps/api`: webhooks, webchat, búsqueda y leads
- `apps/admin`: panel de administración
- `apps/widget`: widget flotante embebible
- `packages/shared`: tipos y utilidades compartidas

## Primer objetivo
Levantar el backend base del producto con arquitectura multi-tenant por `org_id`.
