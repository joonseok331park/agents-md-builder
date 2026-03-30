import { presets } from "./presets";
import { buildAgentsMd } from "@/lib/build-agents-md";
import { createStateFromPreset } from "@/lib/defaults";

export const exampleDocuments = presets.map((preset) => ({
  slug: preset.slug,
  name: preset.name,
  text: buildAgentsMd(createStateFromPreset(preset.slug)),
}));
