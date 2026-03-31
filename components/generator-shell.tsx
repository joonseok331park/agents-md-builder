"use client";

import { useEffect, useMemo, useState } from "react";

import { presets, presetMap } from "@/content/presets";
import { buildAgentsMd } from "@/lib/build-agents-md";
import { copyToClipboard } from "@/lib/clipboard";
import { createDefaultState, createStateFromPreset, isPresetSlug, stripStateMetadata } from "@/lib/defaults";
import { downloadAgentsFile } from "@/lib/download";
import { lintAgentsMd } from "@/lib/lint-agents-md";
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage";
import type { BuilderState, PresetSlug } from "@/lib/types";

import { BuilderForm } from "./builder-form";
import { ExportActions } from "./export-actions";
import { LintPanel } from "./lint-panel";
import { LivePreview } from "./live-preview";
import { PresetPicker } from "./preset-picker";

function formatTimestamp(value: string): string {
  if (!value) {
    return "Not saved yet";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Not saved yet";
  }
}

function readPresetFromQuery(): PresetSlug | null {
  if (typeof window === "undefined") {
    return null;
  }

  const preset = new URLSearchParams(window.location.search).get("preset");
  return preset && isPresetSlug(preset) ? preset : null;
}

function stateDiffersFromPreset(state: BuilderState): boolean {
  const base = createStateFromPreset(state.presetSlug);
  return JSON.stringify(stripStateMetadata(state)) !== JSON.stringify(stripStateMetadata(base));
}

export function GeneratorShell(): JSX.Element {
  const [state, setState] = useState<BuilderState>(createDefaultState());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingPreset, setPendingPreset] = useState<PresetSlug | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const restored = loadDraft();
      if (restored) {
        setState(restored);
        setStatusMessage(
          restored.lastUpdated ? `Restored draft from ${formatTimestamp(restored.lastUpdated)}.` : "Restored saved draft."
        );
        setIsReady(true);
        return;
      }

      const presetFromQuery = readPresetFromQuery();
      if (presetFromQuery) {
        setState(createStateFromPreset(presetFromQuery));
      }
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const markdown = useMemo(() => buildAgentsMd(state), [state]);
  const lintItems = useMemo(() => lintAgentsMd(state, markdown), [state, markdown]);

  const commitState = (nextState: BuilderState, nextMessage?: string) => {
    const stampedState = {
      ...nextState,
      lastUpdated: new Date().toISOString(),
    };
    setState(stampedState);
    saveDraft(stampedState);
    setStatusMessage(nextMessage ?? `Saved draft at ${formatTimestamp(stampedState.lastUpdated)}.`);
  };

  const requestPresetChange = (presetSlug: PresetSlug) => {
    if (presetSlug === state.presetSlug) {
      return;
    }

    if (stateDiffersFromPreset(state)) {
      setPendingPreset(presetSlug);
      return;
    }

    commitState(createStateFromPreset(presetSlug), `Loaded the ${presetMap[presetSlug].name} preset.`);
  };

  const applyPendingPreset = () => {
    if (!pendingPreset) {
      return;
    }
    commitState(createStateFromPreset(pendingPreset), `Loaded the ${presetMap[pendingPreset].name} preset.`);
    setPendingPreset(null);
  };

  const cancelPendingPreset = () => {
    setPendingPreset(null);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(markdown);
      setStatusMessage("Copied AGENTS.md to the clipboard.");
    } catch {
      setStatusMessage("Copy failed. Select the preview text manually and copy it.");
    }
  };

  const handleDownload = () => {
    downloadAgentsFile(markdown);
    setStatusMessage("Downloaded AGENTS.md.");
  };

  const handleReset = () => {
    commitState(createStateFromPreset(state.presetSlug), `Reset the draft to the ${presetMap[state.presetSlug].name} preset defaults.`);
  };

  const handleClearSaved = () => {
    clearDraft();
    setStatusMessage("Cleared the saved local draft. Future edits will save again.");
  };

  return (
    <section id="builder" className="builderShell">
      <div className="builderGrid">
        <div className="stackColumn formColumn">
          <PresetPicker
            presets={presets}
            activePreset={state.presetSlug}
            pendingPreset={pendingPreset}
            onSelect={requestPresetChange}
          />
          {pendingPreset ? (
            <section className="cardStack pendingBanner" aria-live="polite">
              <h2>Preset switch will replace the current draft</h2>
              <p>
                You changed the current preset draft. Apply <strong>{presetMap[pendingPreset].name}</strong> to replace the
                current values, or keep editing the current draft.
              </p>
              <div className="buttonRow">
                <button type="button" className="primaryButton" onClick={applyPendingPreset}>
                  Apply preset reset
                </button>
                <button type="button" className="secondaryButton" onClick={cancelPendingPreset}>
                  Keep current draft
                </button>
              </div>
            </section>
          ) : null}
          <BuilderForm state={state} onChange={commitState} />
        </div>
        <div className="stackColumn stickyColumn">
          <ExportActions
            lastSaved={isReady ? formatTimestamp(state.lastUpdated) : "Loading draft..."}
            statusMessage={statusMessage}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onReset={handleReset}
            onClearSaved={handleClearSaved}
          />
          <LintPanel items={lintItems} />
          <LivePreview markdown={markdown} />
        </div>
      </div>
    </section>
  );
}
