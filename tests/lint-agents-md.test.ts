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

  it("flags missing project name", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectName = "   ";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Missing project name")).toBe(true);
  });

  it("flags missing project purpose", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectPurpose = "";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Missing project purpose")).toBe(true);
  });

  it("flags missing commit policy", () => {
    const state = createStateFromPreset("nextjs-static");
    state.commitRules = [];

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Missing commit policy")).toBe(true);
  });

  it("flags missing branching policy", () => {
    const state = createStateFromPreset("nextjs-static");
    state.branchRules = [];

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Missing branching policy")).toBe(true);
  });

  it("flags missing architecture notes", () => {
    const state = createStateFromPreset("nextjs-static");
    state.repoStructureNotes = "  ";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Missing architecture notes")).toBe(true);
  });

  it("flags missing install command as a tip", () => {
    const state = createStateFromPreset("nextjs-static");
    state.installCommand = "";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    const tip = items.find((item) => item.title === "Install command missing");
    expect(tip).toBeDefined();
    expect(tip?.severity).toBe("tip");
  });

  it("flags missing dev command as a tip", () => {
    const state = createStateFromPreset("nextjs-static");
    state.devCommand = "";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    const tip = items.find((item) => item.title === "Dev command missing");
    expect(tip).toBeDefined();
    expect(tip?.severity).toBe("tip");
  });

  it("flags duplicate commands", () => {
    const state = createStateFromPreset("nextjs-static");
    state.lintCommand = "npm run build";
    state.buildCommand = "npm run build";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Duplicate commands")).toBe(true);
  });

  it("sorts items by severity: errors first, then warnings, then tips", () => {
    const state = createStateFromPreset("nextjs-static");
    state.forbiddenActions = [];
    state.commitRules = [];
    state.installCommand = "";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    const rank = { error: 0, warning: 1, tip: 2 } as const;
    for (let i = 1; i < items.length; i++) {
      expect(rank[items[i - 1].severity]).toBeLessThanOrEqual(rank[items[i].severity]);
    }
  });

  it("returns no errors for a well-formed default preset state", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectName = "Docs Site";
    state.projectPurpose = "Publish a statically exported product documentation site.";
    const items = lintAgentsMd(state, buildAgentsMd(state));

    const errors = items.filter((item) => item.severity === "error");
    expect(errors).toHaveLength(0);
  });

  it("detects placeholder-like project name", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectName = "TBD project name";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Placeholder text detected")).toBe(true);
  });

  it("detects placeholder package names in commands", () => {
    const state = createStateFromPreset("python-cli");
    state.devCommand = "uv run python -m your_package";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Placeholder text detected")).toBe(true);
  });

  it("flags stack-inconsistent commands for node presets missing npm", () => {
    const state = createStateFromPreset("nextjs-static");
    state.installCommand = "make install";
    state.devCommand = "make dev";
    state.lintCommand = "make lint";
    state.typecheckCommand = "make check";
    state.buildCommand = "make build";
    state.testCommand = "make test";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Stack-inconsistent commands")).toBe(true);
  });

  it("does not flag stack-inconsistent commands for python preset with uv commands", () => {
    const state = createStateFromPreset("python-cli");

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Stack-inconsistent commands")).toBe(false);
  });

  it("does not flag duplicate commands when all commands are distinct", () => {
    const state = createStateFromPreset("vite-react");

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Duplicate commands")).toBe(false);
  });

  it("flags vague language in project purpose", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectPurpose = "A project that should handle as needed";

    const items = lintAgentsMd(state, buildAgentsMd(state));

    expect(items.some((item) => item.title === "Vague instruction detected")).toBe(true);
  });

  it("flags duplicate headings in generated markdown", () => {
    const state = createStateFromPreset("nextjs-static");
    const markdownWithDuplicateHeadings = [
      "# Project Purpose",
      "- content",
      "",
      "# Hard Constraints",
      "- constraint",
      "",
      "# Project Purpose",
      "- more content",
    ].join("\n");

    const items = lintAgentsMd(state, markdownWithDuplicateHeadings);

    expect(items.some((item) => item.title === "Duplicate headings")).toBe(true);
  });
});
