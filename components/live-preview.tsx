type LivePreviewProps = {
  markdown: string;
};

export function LivePreview({ markdown }: LivePreviewProps): JSX.Element {
  return (
    <section className="cardStack previewCard">
      <div className="sectionHeader">
        <h2>Live AGENTS.md preview</h2>
        <span className="mutedText">Plain text only</span>
      </div>
      <div className="codePreview">
        <div className="codePreviewHeader">
          <div className="codePreviewDots">
            <span className="codePreviewDot codePreviewDotRed" />
            <span className="codePreviewDot codePreviewDotAmber" />
            <span className="codePreviewDot codePreviewDotGreen" />
          </div>
          <span className="codePreviewFilename">AGENTS.md</span>
        </div>
        <pre className="codePreviewBody">{markdown}</pre>
      </div>
    </section>
  );
}
