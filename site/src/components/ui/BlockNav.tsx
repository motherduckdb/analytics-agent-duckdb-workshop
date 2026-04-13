"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme, PARTS, partHref } from "@/lib/theme";

export function BlockNav({
  total,
  current,
  onChange,
  partId,
}: {
  total: number;
  current: number;
  onChange: (index: number) => void;
  partId: string;
}) {
  const router = useRouter();

  const partIndex = PARTS.findIndex((p) => p.id === partId);
  const prevPart = partIndex > 0 ? PARTS[partIndex - 1] : null;
  const nextPart = partIndex < PARTS.length - 1 ? PARTS[partIndex + 1] : null;

  const isFirst = current === 0;
  const isLast = current === total - 1;

  const prev = useCallback(() => {
    if (!isFirst) {
      onChange(current - 1);
    } else if (prevPart) {
      router.push(partHref(prevPart));
    }
  }, [current, isFirst, prevPart, onChange, router]);

  const next = useCallback(() => {
    if (!isLast) {
      onChange(current + 1);
    } else if (nextPart) {
      router.push(partHref(nextPart));
    }
  }, [current, isLast, nextPart, onChange, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const prevLabel = isFirst && prevPart ? `← ${prevPart.label}` : "←";
  const nextLabel = isLast && nextPart ? `${nextPart.label} →` : "→";
  const prevDisabled = isFirst && !prevPart;
  const nextDisabled = isLast && !nextPart;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 0",
        fontFamily: theme.bodyFont,
      }}
    >
      <button
        onClick={prev}
        disabled={prevDisabled}
        style={{
          padding: "4px 12px",
          fontSize: 12,
          border: `1.5px solid ${theme.grid}`,
          borderRadius: 6,
          background: prevDisabled ? theme.snow : theme.surface,
          color: prevDisabled ? theme.muted : theme.text,
          cursor: prevDisabled ? "default" : "pointer",
          fontFamily: theme.titleFont,
          whiteSpace: "nowrap",
        }}
      >
        {prevLabel}
      </button>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={`Block ${i + 1}`}
            style={{
              width: i === current ? 24 : 10,
              height: 10,
              borderRadius: 5,
              border: "none",
              background: i === current ? theme.accent : theme.grid,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>

      <span
        style={{
          fontSize: 11,
          color: theme.muted,
          minWidth: 40,
          textAlign: "center",
        }}
      >
        {current + 1}/{total}
      </span>

      <button
        onClick={next}
        disabled={nextDisabled}
        style={{
          padding: "4px 12px",
          fontSize: 12,
          border: `1.5px solid ${theme.grid}`,
          borderRadius: 6,
          background: nextDisabled ? theme.snow : theme.surface,
          color: nextDisabled ? theme.muted : theme.text,
          cursor: nextDisabled ? "default" : "pointer",
          fontFamily: theme.titleFont,
          whiteSpace: "nowrap",
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}
