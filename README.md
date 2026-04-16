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

## Variables de entorno iniciales
Para consumir las APIs actuales del CRM/core:

```env
CRM_API_BASE_URL=https://api-uat.urbanube.com
CRM_SEARCH_TOKEN=tu_access_token_actual
```
