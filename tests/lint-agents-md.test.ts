import { buildAgentsMd } from "@/lib/build-agents-md";
import { createStateFromPreset } from "@/lib/defaults";
import { lintAgentsMd } from "@/lib/lint-agents-md";

describe("lintAgentsMd", () => {
  it("flags missing forbidden actions and verification commands", () => {
    const state = createStateFromPreset("nextjs-static");
    state.forbiddenActions = [];
    state.lintCommand = "";
    state.typecheckCommand = "";
    state.buildCommand = "";
    state.testCommand = "";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "No forbidden actions")).toBe(true);
    expect(items.some((item) => item.title === "Missing verification coverage")).toBe(true);
  });

  it("flags vague placeholder-like language", () => {
    const state = createStateFromPreset("vite-react");
    state.extraNotes = ["TODO: do the right thing here."];

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Vague instruction detected")).toBe(true);
    expect(items.some((item) => item.title === "Placeholder text detected")).toBe(true);
  });

  it("flags stack-inconsistent commands for python presets", () => {
    const state = createStateFromPreset("python-cli");
    state.installCommand = "npm install";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Stack-inconsistent commands")).toBe(true);
  });
});
