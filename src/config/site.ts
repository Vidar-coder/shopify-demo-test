import { sites } from "./sites";
import type { SiteConfig, Section } from "./types";

const siteId = process.env.NEXT_PUBLIC_SITE_ID || "wagwellness";

const site = sites[siteId];
if (!site) {
  throw new Error(`Unknown NEXT_PUBLIC_SITE_ID "${siteId}". Add it to src/config/sites/index.ts.`);
}

export function getSite(): SiteConfig {
  return site;
}

export function getSection<T extends Section["type"]>(type: T) {
  return site.sections.find((s) => s.type === type) as Extract<Section, { type: T }> | undefined;
}
