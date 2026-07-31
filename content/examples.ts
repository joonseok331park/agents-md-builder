import { presets } from "./presets";
import { buildAgentsMd } from "@/lib/build-agents-md";
import { createStateFromPreset } from "@/lib/defaults";

export const exampleDocuments = presets.map((preset) => {
  const state = createStateFromPreset(preset.slug);
  state.projectName = `${preset.name} Example`;
  state.projectPurpose = `Show a maintainable ${preset.shortLabel} project with explicit setup, testing, and safety rules.`;

  return {
    slug: preset.slug,
    name: preset.name,
    text: buildAgentsMd(state),
  };
});
