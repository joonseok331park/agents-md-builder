import type { LintItem } from "@/lib/types";

type LintPanelProps = {
  items: LintItem[];
};

function severityLabel(severity: LintItem["severity"]): string {
  if (severity === "error") {
    return "Error";
  }
  if (severity === "warning") {
    return "Warning";
  }
  return "Tip";
}

export function LintPanel({ items }: LintPanelProps): JSX.Element {
  if (items.length === 0) {
    return (
      <section className="cardStack">
        <div className="sectionHeader">
          <h2>Lint panel</h2>
          <span className="badge badgeSuccess">Clear</span>
        </div>
        <p className="successText statusMessage">No lint warnings right now. The draft is clean and scannable.</p>
      </section>
    );
  }

  return (
    <section className="cardStack">
      <div className="sectionHeader">
        <h2>Lint panel</h2>
        <span className="badge">{items.length} items</span>
      </div>
      <div className="lintList">
        {items.map((item) => (
          <article key={`${item.severity}-${item.title}-${item.guidance}`} className={`lintItem lintItem${item.severity}`}>
            <div className="lintHeader">
              <span className={`badge badge${item.severity}`}>{severityLabel(item.severity)}</span>
              <strong>{item.title}</strong>
            </div>
            <p>{item.guidance}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
