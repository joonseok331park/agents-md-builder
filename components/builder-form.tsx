"use client";

import type { BuilderState } from "@/lib/types";

type BuilderFormProps = {
  state: BuilderState;
  onChange: (nextState: BuilderState) => void;
};

type RuleListEditorProps = {
  label: string;
  description: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
};

function RuleListEditor({
  label,
  description,
  values,
  placeholder,
  onChange,
}: RuleListEditorProps): JSX.Element {
  const updateAt = (index: number, nextValue: string) => {
    onChange(values.map((value, currentIndex) => (currentIndex === index ? nextValue : value)));
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="fieldGroup">
      <div className="fieldHeader">
        <span>{label}</span>
        <span className="mutedText">{description}</span>
      </div>
      <div className="ruleList">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="ruleRow">
            <input
              type="text"
              className="textInput"
              value={value}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              onChange={(event) => updateAt(index, event.target.value)}
            />
            <button type="button" className="ghostButton" onClick={() => removeAt(index)} aria-label={`Remove ${label} row`}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="secondaryButton" onClick={() => onChange([...values, ""])}>
          Add row
        </button>
      </div>
    </div>
  );
}

export function BuilderForm({ state, onChange }: BuilderFormProps): JSX.Element {
  const updateField = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
    onChange({ ...state, [key]: value });
  };

  return (
    <section className="cardStack">
      <div className="sectionHeader">
        <h2>Structured builder form</h2>
        <p className="mutedText">Required fields first, then stack rules, workflow rules, and optional notes.</p>
      </div>
      <div className="formGrid">
        <div className="fieldGroup">
          <label htmlFor="projectName">Project name</label>
          <input
            id="projectName"
            type="text"
            className="textInput"
            value={state.projectName}
            placeholder="Repository name"
            onChange={(event) => updateField("projectName", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="projectPurpose">One-line purpose</label>
          <input
            id="projectPurpose"
            type="text"
            className="textInput"
            value={state.projectPurpose}
            placeholder="What this repository builds or maintains"
            onChange={(event) => updateField("projectPurpose", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="runtime">Primary language or runtime</label>
          <input
            id="runtime"
            type="text"
            className="textInput"
            value={state.runtime}
            onChange={(event) => updateField("runtime", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="packageManager">Package manager</label>
          <input
            id="packageManager"
            type="text"
            className="textInput"
            value={state.packageManager}
            onChange={(event) => updateField("packageManager", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="installCommand">Install command</label>
          <input
            id="installCommand"
            type="text"
            className="textInput"
            value={state.installCommand}
            onChange={(event) => updateField("installCommand", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="devCommand">Dev command</label>
          <input
            id="devCommand"
            type="text"
            className="textInput"
            value={state.devCommand}
            onChange={(event) => updateField("devCommand", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="lintCommand">Lint command</label>
          <input
            id="lintCommand"
            type="text"
            className="textInput"
            value={state.lintCommand}
            onChange={(event) => updateField("lintCommand", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="typecheckCommand">Typecheck command</label>
          <input
            id="typecheckCommand"
            type="text"
            className="textInput"
            value={state.typecheckCommand}
            onChange={(event) => updateField("typecheckCommand", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="buildCommand">Build command</label>
          <input
            id="buildCommand"
            type="text"
            className="textInput"
            value={state.buildCommand}
            onChange={(event) => updateField("buildCommand", event.target.value)}
          />
        </div>
        <div className="fieldGroup">
          <label htmlFor="testCommand">Test command</label>
          <input
            id="testCommand"
            type="text"
            className="textInput"
            value={state.testCommand}
            onChange={(event) => updateField("testCommand", event.target.value)}
          />
        </div>
      </div>
      <div className="fieldGroup">
        <label htmlFor="repoStructureNotes">Directory or architecture notes</label>
        <textarea
          id="repoStructureNotes"
          className="textArea"
          value={state.repoStructureNotes}
          onChange={(event) => updateField("repoStructureNotes", event.target.value)}
        />
      </div>
      <RuleListEditor
        label="Code style rules"
        description="Short, imperative rules for how the code should be written."
        values={state.codeStyleRules}
        placeholder="Prefer small pure functions over layered abstractions."
        onChange={(values) => updateField("codeStyleRules", values)}
      />
      <RuleListEditor
        label="Testing instructions"
        description="What agents must verify before they finish."
        values={state.testingRules}
        placeholder="Add Vitest coverage for builder and linter changes."
        onChange={(values) => updateField("testingRules", values)}
      />
      <RuleListEditor
        label="Safety rules"
        description="Rules about sensitive changes, storage, and risky behavior."
        values={state.securityRules}
        placeholder="Keep user drafts in localStorage only."
        onChange={(values) => updateField("securityRules", values)}
      />
      <RuleListEditor
        label="Forbidden actions"
        description="Non-negotiable things the agent must never add or do."
        values={state.forbiddenActions}
        placeholder="Do not add undeclared backend routes or network services."
        onChange={(values) => updateField("forbiddenActions", values)}
      />
      <RuleListEditor
        label="Commit rules"
        description="How and when the agent should commit."
        values={state.commitRules}
        placeholder="Commit only after lint, typecheck, test, and build pass."
        onChange={(values) => updateField("commitRules", values)}
      />
      <RuleListEditor
        label="Branch rules"
        description="When the agent should branch and how to scope work."
        values={state.branchRules}
        placeholder="Use feature/ or fix/ branches for behavior changes."
        onChange={(values) => updateField("branchRules", values)}
      />
      <RuleListEditor
        label="Pull request rules"
        description="What should appear in review-ready summaries."
        values={state.prRules}
        placeholder="List validation commands and user-visible changes."
        onChange={(values) => updateField("prRules", values)}
      />
      <RuleListEditor
        label="Optional project notes"
        description="Extra reminders that should only appear when they add signal."
        values={state.extraNotes}
        placeholder="Preserve preset query links in template CTAs."
        onChange={(values) => updateField("extraNotes", values)}
      />
    </section>
  );
}
