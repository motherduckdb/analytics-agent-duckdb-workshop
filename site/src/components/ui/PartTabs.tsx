"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme, PARTS, partHref } from "@/lib/theme";
import { useSlideState } from "@/components/SlideState";

export function PartTabs() {
  const pathname = usePathname();
  const { state } = useSlideState();

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
      {PARTS.map((part, i) => {
        const href = partHref(part);
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(href + "/");
        const showPosition = active && state.partId === part.id && state.total > 0;

        return (
          <Link
            key={part.id}
            href={href}
            style={{
              padding: "12px 18px",
              fontSize: 14,
              fontWeight: active ? 700 : 400,
              color: active ? theme.text : theme.muted,
              borderBottom: active
                ? `2px solid ${theme.accent}`
                : "2px solid transparent",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              fontFamily: theme.titleFont,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              lineHeight: 1.2,
            }}
          >
            <span>
              <span style={{ color: theme.muted, marginRight: 6 }}>
                {i + 1}.
              </span>
              {part.label}
              {showPosition && (
                <span
                  style={{
                    marginLeft: 8,
                    color: theme.accent,
                    fontWeight: 700,
                  }}
                >
                  {state.current + 1}/{state.total}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: theme.muted,
                fontFamily: theme.bodyFont,
                marginTop: 3,
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
