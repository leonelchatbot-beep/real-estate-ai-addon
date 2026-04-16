# Arquitectura inicial

## Objetivo
Producto SaaS separado del CRM principal, multi-inmobiliaria, con billing por suscripción + consumo de IA.

## Módulos
- Channels: Meta (WhatsApp/Instagram) + Webchat
- Bot Engine: prompt base global + configuración por org
- Property Search: lectura desde `reporting.mv_properties`
- Leads: escritura en `property_leads` + tablas auxiliares
- Billing: suscripción mensual + consumo IA por org
- Admin: configuración, conversaciones, leads, prompts y canales

## Principios
- Multi-tenant por `org_id`
- Prompt base protegido
- Configuración editable por inmobiliaria
- Búsqueda primero por oficina y fallback global si hay menos de 3 resultados
- Máximo 3 propiedades por respuesta
- Crear lead cuando detecta interés real o pedido de contacto humano
