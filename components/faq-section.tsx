import type { FaqItem } from "@/lib/types";

type FaqSectionProps = {
  items: FaqItem[];
  title: string;
};

export function FaqSection({ items, title }: FaqSectionProps): JSX.Element {
  return (
    <section className="articleCard">
      <h2>{title}</h2>
      <div className="faqList">
        {items.map((item) => (
          <details key={item.question} className="faqItem">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
