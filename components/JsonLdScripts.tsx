/** Randare sigură pentru JSON-LD extras din HTML vechi (conținut static controlat). */
export function JsonLdScripts({ blocks }: { blocks: string[] }) {
  return (
    <>
      {blocks.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
    </>
  );
}
