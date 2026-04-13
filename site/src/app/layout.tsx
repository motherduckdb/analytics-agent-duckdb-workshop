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
