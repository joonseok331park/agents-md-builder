import { afterEach, describe, expect, it, vi } from "vitest";

import { clearDraft, loadDraft, saveDraft } from "@/lib/storage";
import { createStateFromPreset } from "@/lib/defaults";

function unavailableStorage(): Storage {
  const fail = () => {
    throw new DOMException("Storage is unavailable", "SecurityError");
  };

  return {
    clear: fail,
    getItem: fail,
    key: fail,
    removeItem: fail,
    setItem: fail,
    length: 0,
  };
}

describe("storage failure handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads without throwing when localStorage is unavailable", () => {
    vi.stubGlobal("window", { localStorage: unavailableStorage() });

    expect(loadDraft()).toBeNull();
  });

  it("saves and clears without throwing when localStorage is unavailable", () => {
    vi.stubGlobal("window", { localStorage: unavailableStorage() });
    const state = createStateFromPreset("nextjs-static");

    expect(() => saveDraft(state)).not.toThrow();
    expect(() => clearDraft()).not.toThrow();
  });
});
