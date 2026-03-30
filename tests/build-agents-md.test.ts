import { buildAgentsMd } from "@/lib/build-agents-md";
import { createStateFromPreset } from "@/lib/defaults";

describe("buildAgentsMd", () => {
  it("renders the required sections in order", () => {
    const markdown = buildAgentsMd(createStateFromPreset("nextjs-static"));

    expect(markdown.indexOf("# Project Purpose")).toBeLessThan(markdown.indexOf("# Hard Constraints"));
    expect(markdown.indexOf("# Hard Constraints")).toBeLessThan(markdown.indexOf("# Setup and Verification Commands"));
    expect(markdown.indexOf("# Setup and Verification Commands")).toBeLessThan(markdown.indexOf("# Code Conventions"));
    expect(markdown.indexOf("# Code Conventions")).toBeLessThan(markdown.indexOf("# Safety Rules"));
    expect(markdown.indexOf("# Safety Rules")).toBeLessThan(markdown.indexOf("# Git Workflow Rules"));
    expect(markdown.indexOf("# Git Workflow Rules")).toBeLessThan(markdown.indexOf("# Directory or Architecture Notes"));
  });

  it("omits the optional notes section when no notes are present", () => {
    const state = createStateFromPreset("vite-react");
    state.extraNotes = [];

    const markdown = buildAgentsMd(state);

    expect(markdown).not.toContain("# Optional Project-Specific Notes");
  });

  it("deduplicates repeated rule entries", () => {
    const state = createStateFromPreset("node-cli-ts");
    state.forbiddenActions = [
      "Do not add background services or daemons.",
      "do not add background services or daemons.",
    ];

    const markdown = buildAgentsMd(state);

    expect(markdown.match(/Do not add background services or daemons\./g)).toHaveLength(1);
  });
});
