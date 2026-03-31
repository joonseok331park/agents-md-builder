import { presets } from "@/content/presets";
import type { PresetSlug } from "./types";

export const coreRoutes = ["/", "/guide", "/examples", "/about", "/privacy", "/terms", "/contact"] as const;

export function createTemplateRoute(slug: PresetSlug): string {
  return `/templates/${slug}`;
}

export function createPresetQueryHref(slug: PresetSlug): string {
  return `/?preset=${slug}`;
}

export const templateRoutes = presets.map((preset) => createTemplateRoute(preset.slug));
