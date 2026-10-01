import type { SiteConfig } from "@/config/types";
import { wagwellness } from "./wagwellness";

/** Register every business here. The key is the value of NEXT_PUBLIC_SITE_ID. */
export const sites: Record<string, SiteConfig> = {
  wagwellness,
};
