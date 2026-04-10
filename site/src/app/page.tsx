import Link from "next/link";
import { theme, PARTS } from "@/lib/theme";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: theme.bodyFont,
      }}
    >
      <h1 style={{ fontSize: 32, fontFamily: theme.titleFont, margin: "0 0 8px" }}>
        SQL is Dead, Long Live SQL
      </h1>
      <p style={{ fontSize: 15, color: theme.muted, margin: "0 0 32px" }}>
        Build an analytics agent powered by DuckDB, a semantic layer, and MCP.
        <br />
        Go from &ldquo;what&rsquo;s inside an agent?&rdquo; to &ldquo;anyone can
        use my tools.&rdquo;
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PARTS.map((part, i) => (
          <Link
            key={part.id}
            href={`/${part.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 18px",
              background: theme.surface,
              border: `1.5px solid ${theme.grid}`,
              borderRadius: 8,
              textDecoration: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: theme.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: theme.titleFont,
                flexShrink: 0,
              }}
            >
              {i}
            </span>
            <div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.text,
                  fontFamily: theme.titleFont,
                }}
              >
                {part.label}
              </span>
              <span style={{ fontSize: 12, color: theme.muted, marginLeft: 8 }}>
                {part.tagline}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: theme.muted,
          fontFamily: theme.titleFont,
        }}
      >
        PyCon DE &amp; PyData 2026 &mdash; April 14, Dynamicum
      </p>
    </div>
  );
}
