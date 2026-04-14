import type { Metadata } from "next";
import "./globals.css";
import { PartTabs } from "@/components/ui/PartTabs";
import { SlideStateProvider } from "@/components/SlideState";
import { PresentationShell } from "@/components/PresentationShell";
import { theme } from "@/lib/theme";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "SQL is Dead, Long Live SQL — Workshop",
  description:
    "Build an analytics agent with DuckDB, PydanticAI, and MCP. PyCon DE & PyData 2026.",
};

const quickLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "7px 14px",
  fontSize: 13,
  fontFamily: theme.titleFont,
  color: theme.text,
  background: theme.snow,
  border: `1.5px solid ${theme.grid}`,
  borderRadius: 999,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const quickLinkLabel: React.CSSProperties = {
  color: theme.muted,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontSize: 12,
};

const quickLinkUrl: React.CSSProperties = {
  color: theme.accent,
  fontWeight: 700,
};

const header = (
  <header
    style={{
      background: theme.surface,
      borderBottom: `1.5px solid ${theme.grid}`,
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
    }}
  >
    <div>
      <h1
        style={{
          fontSize: 19,
          fontWeight: 700,
          fontFamily: theme.titleFont,
          color: theme.text,
          margin: 0,
        }}
      >
        SQL is Dead, Long Live SQL
      </h1>
      <p
        style={{
          fontSize: 13,
          color: theme.muted,
          margin: 0,
          fontFamily: theme.bodyFont,
        }}
      >
        PyCon DE &amp; PyData 2026 &mdash; 90 min workshop
      </p>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <a
        href="https://motherduck.com/minter"
        target="_blank"
        rel="noreferrer"
        style={quickLinkStyle}
      >
        <span style={quickLinkLabel}>Grab your LLM key</span>
        <span aria-hidden>→</span>
        <span style={quickLinkUrl}>motherduck.com/minter</span>
        <span aria-hidden style={{ color: theme.muted, fontSize: 12 }}>↗</span>
      </a>
      <a
        href="https://motherduck.com/pyconde2026"
        target="_blank"
        rel="noreferrer"
        style={quickLinkStyle}
      >
        <span style={quickLinkLabel}>Slides</span>
        <span aria-hidden>→</span>
        <span style={quickLinkUrl}>motherduck.com/pyconde2026</span>
        <span aria-hidden style={{ color: theme.muted, fontSize: 12 }}>↗</span>
      </a>
      <a
        href="https://github.com/motherduckdb/analytics-agent-duckdb-workshop"
        target="_blank"
        rel="noreferrer"
        style={quickLinkStyle}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span style={quickLinkLabel}>Repo</span>
        <span aria-hidden style={{ color: theme.muted, fontSize: 12 }}>↗</span>
      </a>
      <a
        href="https://motherduck.com"
        target="_blank"
        rel="noreferrer"
        aria-label="MotherDuck"
        style={{ display: "inline-flex", alignItems: "center", marginLeft: 6 }}
      >
        <img
          src={asset("/motherduck-logo.svg")}
          alt="MotherDuck"
          style={{ height: 28, width: "auto" }}
        />
      </a>
    </div>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SlideStateProvider>
          <PresentationShell header={header} tabs={<PartTabs />}>
            {children}
          </PresentationShell>
        </SlideStateProvider>
      </body>
    </html>
  );
}
