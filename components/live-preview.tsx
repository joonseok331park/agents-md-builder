type LivePreviewProps = {
  markdown: string;
};

export function LivePreview({ markdown }: LivePreviewProps): JSX.Element {
  return (
    <section className="cardStack previewCard">
      <div className="sectionHeader">
        <h2>Live AGENTS.md preview</h2>
        <span className="mutedText">Plain text only. No rendered markdown.</span>
      </div>
      <pre className="codePreview">{markdown}</pre>
    </section>
  );
}
