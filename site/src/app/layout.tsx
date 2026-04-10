import type { Metadata } from "next";
import "./globals.css";
import { PartTabs } from "@/components/ui/PartTabs";
import { theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "SQL is Dead, Long Live SQL — Workshop",
  description:
    "Build an analytics agent with DuckDB, PydanticAI, and MCP. PyCon DE & PyData 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header
          style={{
            background: theme.surface,
            borderBottom: `1.5px solid ${theme.grid}`,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 16,
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
                fontSize: 11,
                color: theme.muted,
                margin: 0,
                fontFamily: theme.bodyFont,
              }}
            >
              PyCon DE &amp; PyData 2026 &mdash; 90 min workshop
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              color: theme.muted,
              fontFamily: theme.titleFont,
            }}
          >
            motherduck.com
          </span>
        </header>
        <PartTabs />
        <main style={{ flex: 1, background: theme.bg }}>{children}</main>
      </body>
    </html>
  );
}
