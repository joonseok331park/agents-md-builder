type ExportActionsProps = {
  lastSaved: string;
  statusMessage: string | null;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
  onClearSaved: () => void;
};

export function ExportActions({
  lastSaved,
  statusMessage,
  onCopy,
  onDownload,
  onReset,
  onClearSaved,
}: ExportActionsProps): JSX.Element {
  return (
    <section className="cardStack">
      <div className="sectionHeader">
        <h2>Export actions</h2>
        <span className="mutedText">Last saved: {lastSaved}</span>
      </div>
      <div className="buttonRow">
        <button type="button" className="primaryButton" onClick={onCopy}>
          Copy
        </button>
        <button type="button" className="secondaryButton" onClick={onDownload}>
          Download AGENTS.md
        </button>
        <button type="button" className="secondaryButton" onClick={onReset}>
          Reset to preset
        </button>
        <button type="button" className="ghostButton" onClick={onClearSaved}>
          Clear saved draft
        </button>
      </div>
      {statusMessage ? <p className="statusMessage infoText">{statusMessage}</p> : null}
    </section>
  );
}
