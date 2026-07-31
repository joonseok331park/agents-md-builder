import type { PresetDefinition, PresetSlug } from "@/lib/types";

type PresetPickerProps = {
  presets: PresetDefinition[];
  activePreset: PresetSlug;
  pendingPreset: PresetSlug | null;
  onSelect: (slug: PresetSlug) => void;
};

export function PresetPicker({
  presets,
  activePreset,
  pendingPreset,
  onSelect,
}: PresetPickerProps): JSX.Element {
  return (
    <section className="cardStack">
      <div className="sectionHeader">
        <h2>Preset picker</h2>
        <p className="mutedText">Choose a strong starting point, then edit only what is specific to your repository.</p>
      </div>
      <div className="presetGrid">
        {presets.map((preset) => {
          const isActive = preset.slug === activePreset;
          const isPending = preset.slug === pendingPreset;

          return (
            <button
              key={preset.slug}
              type="button"
              className={`presetCard${isActive ? " presetCardActive" : ""}${isPending ? " presetCardPending" : ""}`}
              aria-pressed={isActive}
              onClick={() => onSelect(preset.slug)}
            >
              <span className="presetLabel">{preset.shortLabel}</span>
              <strong>{preset.name}</strong>
              <span>{preset.shortDescription}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
