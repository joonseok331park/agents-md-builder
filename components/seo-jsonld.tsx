type SeoJsonLdProps = {
  data: Record<string, unknown>;
};

export function SeoJsonLd({ data }: SeoJsonLdProps): JSX.Element {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
