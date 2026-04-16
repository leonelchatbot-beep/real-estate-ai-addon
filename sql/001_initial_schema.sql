-- Extensión mínima sugerida de property_leads
alter table if exists property_leads
  add column if not exists channel varchar(30) null,
  add column if not exists lead_type varchar(30) null,
  add column if not exists conversation_summary text null,
  add column if not exists lead_score int null,
  add column if not exists lead_temperature varchar(20) null,
  add column if not exists human_handoff_requested boolean default false,
  add column if not exists human_handoff_at timestamptz null,
  add column if not exists operation_type varchar(20) null,
  add column if not exists property_type varchar(50) null,
  add column if not exists zone varchar(120) null,
  add column if not exists budget_min numeric null,
  add column if not exists budget_max numeric null,
  add column if not exists currency varchar(10) null,
  add column if not exists bedrooms int null,
  add column if not exists urgency varchar(20) null;

create table if not exists chat_sessions (
  session_id uuid primary key default gen_random_uuid(),
  org_id varchar(36) not null,
  customer_id varchar(36) null,
  channel varchar(30) not null,
  source_url varchar(500) null,
  referrer_url varchar(500) null,
  landing_url varchar(500) null,
  user_agent varchar(500) null,
  ip_address inet null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references property_leads(lead_id) on delete cascade,
  direction varchar(10) not null,
  sender_type varchar(20) not null,
  content text not null,
  created_at timestamptz default now() not null
);

create table if not exists lead_tags (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references property_leads(lead_id) on delete cascade,
  tag varchar(50) not null,
  assigned_by varchar(20) not null,
  confidence numeric null,
  created_at timestamptz default now() not null
);

create table if not exists lead_properties (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references property_leads(lead_id) on delete cascade,
  property_id bigint not null,
  rank_order int not null,
  source_scope varchar(20) not null,
  created_at timestamptz default now() not null
);

create table if not exists bot_prompts (
  prompt_id uuid primary key default gen_random_uuid(),
  org_id varchar(36) not null,
  channel varchar(30) null,
  name varchar(120) not null,
  system_prompt text not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_property_leads_org_created_at on property_leads(org_id, created_at desc);
create index if not exists idx_chat_sessions_org_channel on chat_sessions(org_id, channel);
create index if not exists idx_lead_messages_lead_id on lead_messages(lead_id);
create index if not exists idx_lead_tags_lead_id on lead_tags(lead_id);
create index if not exists idx_lead_properties_lead_id on lead_properties(lead_id);
create index if not exists idx_bot_prompts_org_channel_active on bot_prompts(org_id, channel, is_active);
