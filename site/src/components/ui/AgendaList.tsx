import Link from "next/link";
import { theme, PARTS } from "@/lib/theme";

export function AgendaList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {PARTS.map((part, i) => (
        <Link
          key={part.id}
          href={`/${part.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 16px",
            background: theme.snow,
            border: `1.5px solid ${theme.grid}`,
            borderRadius: 8,
            textDecoration: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: theme.accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
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
  );
}
