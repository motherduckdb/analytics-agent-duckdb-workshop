"use client";

import { useEffect, useRef, useState, useId } from "react";
import { theme } from "@/lib/theme";

/**
 * Renders a Mermaid diagram. Mermaid is a big client-only lib — we dynamically
 * import it so it stays out of the server bundle and SSR output.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const reactId = useId().replace(/:/g, "_");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          fontFamily: theme.bodyFont,
          themeVariables: {
            background: theme.surface,
            primaryColor: theme.surface,
            primaryTextColor: theme.text,
            primaryBorderColor: theme.accent,
            lineColor: theme.muted,
            secondaryColor: theme.snow,
            tertiaryColor: theme.bg,
            fontFamily: theme.bodyFont,
            fontSize: "14px",
          },
        });
        const { svg } = await mermaid.render(`mmd_${reactId}`, chart);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setErr((e as Error).message || String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  return (
    <figure
      style={{
        margin: "18px 0",
        padding: "20px",
        background: theme.snow,
        border: `1.5px solid ${theme.grid}`,
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      {err ? (
        <pre style={{ color: theme.red, fontSize: 12, textAlign: "left" }}>{err}</pre>
      ) : (
        <div
          ref={ref}
          style={{ display: "flex", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      {caption && (
        <figcaption
          style={{
            marginTop: 10,
            fontFamily: theme.titleFont,
            fontSize: 11,
            color: theme.muted,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
