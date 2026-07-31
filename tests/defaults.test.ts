import { createStateFromPreset, isPresetSlug } from "@/lib/defaults";

describe("preset defaults", () => {
  it("accepts only declared preset slugs", () => {
    expect(isPresetSlug("nextjs-static")).toBe(true);
    expect(isPresetSlug("python-cli")).toBe(true);
    expect(isPresetSlug("toString")).toBe(false);
    expect(isPresetSlug("constructor")).toBe(false);
  });

  it("leaves repository identity fields for the user to complete", () => {
    const state = createStateFromPreset("vite-react");

    expect(state.projectName).toBe("");
    expect(state.projectPurpose).toBe("");
  });

  it("does not ship a placeholder Python module command", () => {
    const state = createStateFromPreset("python-cli");

    expect(state.devCommand).toBe("");
    expect(state.buildCommand).toBe("uv build");
  });
});
