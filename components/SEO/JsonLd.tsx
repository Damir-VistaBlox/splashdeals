interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

/**
 * 📈 JsonLd Schema Injector
 * Renders inline <script type="application/ld+json"> element.
 * Must NOT use next/script — that blocks SSR output and Google can't see it.
 * Use plain <script> for SEO-critical structured data.
 */
export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  const jsonLd = JSON.stringify(data);
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}
