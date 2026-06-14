/**
 * Tipos do endpoint público runtime-config.
 * Ver docs/creator-hub-master.md, seção 11.8.
 */

export type BillingStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "limited"
  | "suspended"
  | "canceled";

export type AppStatus = "active" | "limited" | "suspended" | "archived";

export interface RuntimeConfigTheme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
}

export interface RuntimeConfigFeatures {
  events: boolean;
  push: boolean;
  favorites: boolean;
  sponsors: boolean;
  store: boolean;
  community: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface RuntimeConfigEvent {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  url: string | null;
}

/** Resposta quando o tenant está ativo ou em modo limitado. */
export interface RuntimeConfigActiveOrLimited {
  tenantId: string;
  appStatus: "active" | "limited";
  billingStatus: BillingStatus;
  theme: RuntimeConfigTheme;
  features: RuntimeConfigFeatures;
  socialLinks: SocialLink[];
  events: RuntimeConfigEvent[];
  sponsors: unknown[];
  storeLinks: unknown[];
}

/** Resposta quando o tenant está suspenso. */
export interface RuntimeConfigSuspended {
  tenantId: string;
  appStatus: "suspended";
  billingStatus: BillingStatus;
  publicMessage?: string;
  showOfficialLinks: boolean;
  socialLinks: SocialLink[];
}

export type RuntimeConfigResponse =
  | RuntimeConfigActiveOrLimited
  | RuntimeConfigSuspended;
