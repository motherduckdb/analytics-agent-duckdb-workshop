"use client";

import {
  useState,
  useEffect,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { theme, PARTS, partHref } from "@/lib/theme";
import { useSlideState } from "@/components/SlideState";
import { useFullscreen } from "@/components/PresentationShell";

function splitByHr(children: ReactNode): ReactNode[][] {
  const flat = Children.toArray(children);
  const blocks: ReactNode[][] = [[]];

  for (const child of flat) {
    if (
      isValidElement(child) &&
      (child.type === "hr" ||
        (child as ReactElement<{ "data-block-break"?: boolean }>).props?.[
          "data-block-break"
        ])
    ) {
      blocks.push([]);
    } else {
      blocks[blocks.length - 1].push(child);
    }
  }

  return blocks.filter((b) => b.length > 0);
}

export function PartPage({
  partId,
  children,
}: {
  /** Accepted for backwards-compat but no longer rendered above the slide. */
  title?: string;
  partId: string;
  children: ReactNode;
}) {
  const blocks = splitByHr(children);
  const total = blocks.length;
  const searchParams = useSearchParams();
  const startLast = searchParams.get("slide") === "last";
  const [current, setCurrent] = useState(startLast ? Math.max(0, blocks.length - 1) : 0);

  const router = useRouter();
  const { setState } = useSlideState();
  const { fullscreen, toggle: toggleFullscreen } = useFullscreen();

  const partIndex = PARTS.findIndex((p) => p.id === partId);
  const partNumber = partIndex + 1; // 1-based for humans
  const prevPart = partIndex > 0 ? PARTS[partIndex - 1] : null;
  const nextPart =
    partIndex >= 0 && partIndex < PARTS.length - 1 ? PARTS[partIndex + 1] : null;

  const isFirst = current === 0;
  const isLast = current === total - 1;

  // Publish slide position up to the tab bar.
  useEffect(() => {
    setState({ partId, current, total });
  }, [partId, current, total, setState]);

  const prev = useCallback(() => {
    if (!isFirst) {
      setCurrent((c) => c - 1);
    } else if (prevPart) {
      router.push(partHref(prevPart) + "?slide=last");
    }
  }, [isFirst, prevPart, router]);

  const next = useCallback(() => {
    if (!isLast) {
      setCurrent((c) => c + 1);
    } else if (nextPart) {
      router.push(partHref(nextPart));
    }
  }, [isLast, nextPart, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        toggleFullscreen();
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen, prev, next]);

  const prevDisabled = isFirst && !prevPart;
  const nextDisabled = isLast && !nextPart;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
          padding: fullscreen ? "28px 40px" : "20px 32px 28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="block-content"
          style={{
            position: "relative",
            flex: 1,
            background: theme.surface,
            border: `1.5px solid ${theme.grid}`,
            borderRadius: 12,
            padding: "44px 52px 72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontFamily: theme.bodyFont,
            fontSize: 18,
            lineHeight: 1.65,
          }}
        >
          <div>{blocks[current]}</div>

          {/* Overlay slide nav: bottom-right of the card */}
          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: `${theme.surface}E6`,
              border: `1.5px solid ${theme.grid}`,
              borderRadius: 999,
              padding: "6px 12px",
              backdropFilter: "blur(4px)",
              fontFamily: theme.titleFont,
              fontSize: 13,
              color: theme.muted,
            }}
          >
            <button
              onClick={prev}
              disabled={prevDisabled}
              aria-label="Previous slide"
              title="Previous (←)"
              style={navButtonStyle(prevDisabled)}
            >
              ←
            </button>
            <span
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 5,
                minWidth: 64,
                justifyContent: "center",
                color: theme.text,
              }}
            >
              {partNumber > 0 && (
                <span style={{ color: theme.muted }}>{partNumber}.</span>
              )}
              <span>
                {current + 1}/{total}
              </span>
            </span>
            <button
              onClick={next}
              disabled={nextDisabled}
              aria-label="Next slide"
              title="Next (→)"
              style={navButtonStyle(nextDisabled)}
            >
              →
            </button>
            <span
              aria-hidden
              style={{
                width: 1,
                height: 14,
                background: theme.grid,
                margin: "0 2px",
              }}
            />
            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              title={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
              style={navButtonStyle(false)}
            >
              {fullscreen ? "⊗" : "⛶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function navButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    padding: "3px 8px",
    cursor: disabled ? "default" : "pointer",
    fontSize: 17,
    lineHeight: 1,
    color: disabled ? theme.grid : theme.text,
    fontFamily: theme.titleFont,
  };
}
