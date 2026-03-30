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

  it("includes the optional notes section when notes exist", () => {
    const state = createStateFromPreset("nextjs-static");
    state.extraNotes = ["Keep this important reminder."];

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("# Optional Project-Specific Notes");
    expect(markdown).toContain("- Keep this important reminder.");
  });

  it("omits empty string rules from output", () => {
    const state = createStateFromPreset("nextjs-static");
    state.forbiddenActions = ["", "   ", "Valid rule"];

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("- Valid rule");
    expect(markdown).not.toContain("- \n");
  });

  it("ends with a trailing newline", () => {
    const markdown = buildAgentsMd(createStateFromPreset("python-cli"));

    expect(markdown.endsWith("\n")).toBe(true);
    expect(markdown.endsWith("\n\n")).toBe(false);
  });

  it("includes project metadata in the project purpose section", () => {
    const state = createStateFromPreset("nextjs-static");
    state.projectName = "My Project";
    state.projectPurpose = "Build something great";
    state.runtime = "TypeScript";
    state.packageManager = "pnpm";

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("- Project name: My Project");
    expect(markdown).toContain("- Purpose: Build something great");
    expect(markdown).toContain("- Primary runtime: TypeScript");
    expect(markdown).toContain("- Package manager: pnpm");
    expect(markdown).toContain("- Preset: nextjs-static");
  });

  it("includes all non-empty commands in the setup section", () => {
    const state = createStateFromPreset("nextjs-static");
    state.installCommand = "npm install";
    state.devCommand = "npm run dev";
    state.lintCommand = "npm run lint";
    state.typecheckCommand = "npm run typecheck";
    state.buildCommand = "npm run build";
    state.testCommand = "npm run test";

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("- Install: `npm install`");
    expect(markdown).toContain("- Dev: `npm run dev`");
    expect(markdown).toContain("- Lint: `npm run lint`");
    expect(markdown).toContain("- Typecheck: `npm run typecheck`");
    expect(markdown).toContain("- Build: `npm run build`");
    expect(markdown).toContain("- Test: `npm run test`");
  });

  it("omits commands that are empty or whitespace-only", () => {
    const state = createStateFromPreset("nextjs-static");
    state.installCommand = "  ";
    state.devCommand = "";
    state.lintCommand = "npm run lint";

    const markdown = buildAgentsMd(state);

    expect(markdown).not.toContain("- Install:");
    expect(markdown).not.toContain("- Dev:");
    expect(markdown).toContain("- Lint: `npm run lint`");
  });

  it("includes git workflow subheadings when rules exist", () => {
    const state = createStateFromPreset("nextjs-static");

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("## Commit Rules");
    expect(markdown).toContain("## Branch Rules");
    expect(markdown).toContain("## Pull Request Rules");
  });

  it("omits git subheadings when all corresponding rules are empty", () => {
    const state = createStateFromPreset("nextjs-static");
    state.commitRules = [];
    state.branchRules = [];
    state.prRules = [];

    const markdown = buildAgentsMd(state);

    expect(markdown).not.toContain("# Git Workflow Rules");
  });

  it("includes testing instructions subsection when testing rules exist", () => {
    const state = createStateFromPreset("nextjs-static");
    state.testingRules = ["Run Vitest for all changes."];

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("## Testing Instructions");
    expect(markdown).toContain("- Run Vitest for all changes.");
  });

  it("omits testing instructions when no testing rules exist", () => {
    const state = createStateFromPreset("nextjs-static");
    state.testingRules = [];

    const markdown = buildAgentsMd(state);

    expect(markdown).not.toContain("## Testing Instructions");
  });

  it("preserves raw user text literally without wrapping it in HTML", () => {
    const state = createStateFromPreset("nextjs-static");
    state.extraNotes = ["<script>alert('xss')</script>"];

    const markdown = buildAgentsMd(state);

    expect(markdown).toContain("- <script>alert('xss')</script>");
  });

  it("uses markdown headings and lists instead of HTML elements", () => {
    const markdown = buildAgentsMd(createStateFromPreset("nextjs-static"));

    expect(markdown).not.toMatch(/^<h[1-6]>/m);
    expect(markdown).not.toMatch(/^<ul>/m);
    expect(markdown).not.toMatch(/^<li>/m);
    expect(markdown).not.toMatch(/^<p>/m);
    expect(markdown).not.toMatch(/^<div>/m);
    expect(markdown).not.toMatch(/^<section>/m);
  });

  it("uses only markdown headings, not HTML", () => {
    const markdown = buildAgentsMd(createStateFromPreset("vite-react"));

    const headings = markdown.match(/^#{1,3}\s+.+$/gm);
    expect(headings?.length).toBeGreaterThan(0);
  });

  it("produces identical output for identical input", () => {
    const state = createStateFromPreset("chrome-extension-mv3");

    const first = buildAgentsMd(state);
    const second = buildAgentsMd(state);

    expect(first).toBe(second);
  });
});
