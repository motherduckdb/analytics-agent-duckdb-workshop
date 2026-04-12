"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme, PARTS } from "@/lib/theme";

export function PartTabs() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: 2,
        padding: "0 24px",
        borderBottom: `1.5px solid ${theme.grid}`,
        background: theme.surface,
        overflowX: "auto",
        fontFamily: theme.bodyFont,
      }}
    >
      {PARTS.map((part) => {
        const href = `/${part.id}`;
        const active = pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={part.id}
            href={href}
            style={{
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              color: active ? theme.text : theme.muted,
              borderBottom: active ? `2px solid ${theme.accent}` : "2px solid transparent",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              fontFamily: theme.titleFont,
            }}
          >
            {part.label}
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 400,
                color: theme.muted,
                fontFamily: theme.bodyFont,
              }}
            >
              {part.tagline}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
