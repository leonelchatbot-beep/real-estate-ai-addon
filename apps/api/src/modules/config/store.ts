import { DEFAULT_ORG_BOT_CONFIG, type OrgBotConfig } from '@reaa/shared';

const configByOrg = new Map<string, OrgBotConfig>();

export function getOrgBotConfig(orgId: string): OrgBotConfig {
  return configByOrg.get(orgId) ?? { ...DEFAULT_ORG_BOT_CONFIG, orgId };
}

export function setOrgBotConfig(config: OrgBotConfig) {
  configByOrg.set(config.orgId, config);
  return config;
}
