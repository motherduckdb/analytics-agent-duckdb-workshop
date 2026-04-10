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
import { BlockNav } from "@/components/ui/BlockNav";
import { theme } from "@/lib/theme";

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
  title,
  partId,
  children,
}: {
  title: string;
  partId: string;
  children: ReactNode;
}) {
  const blocks = splitByHr(children);
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((f) => {
      if (!f) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      return !f;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
      }
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          toggleFullscreen();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    const onFSChange = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFSChange);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFSChange);
    };
  }, [fullscreen, toggleFullscreen]);

  const wrapper = fullscreen ? "fullscreen-overlay" : "";

  return (
    <div className={wrapper}>
      <div
        style={{
          maxWidth: fullscreen ? 900 : 720,
          margin: "0 auto",
          padding: fullscreen ? "24px 48px 48px" : "16px 24px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: fullscreen ? 26 : 22,
              fontFamily: theme.titleFont,
              margin: "0 0 4px",
            }}
          >
            {title}
          </h1>
          <button
            onClick={toggleFullscreen}
            title={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            style={{
              background: "none",
              border: `1.5px solid ${theme.grid}`,
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 14,
              color: theme.muted,
              fontFamily: theme.titleFont,
            }}
          >
            {fullscreen ? "⊗" : "⛶"}
          </button>
        </div>

        <BlockNav
          total={blocks.length}
          current={current}
          onChange={setCurrent}
          partId={partId}
        />

        <div
          className="block-content"
          style={{
            background: theme.surface,
            border: `1.5px solid ${theme.grid}`,
            borderRadius: 10,
            padding: fullscreen ? "40px 48px" : "28px 32px",
            minHeight: fullscreen ? "calc(100vh - 200px)" : "min(70vh, 560px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontFamily: theme.bodyFont,
            fontSize: fullscreen ? 16 : 14,
            lineHeight: 1.6,
          }}
        >
          <div>{blocks[current]}</div>
        </div>

        <BlockNav
          total={blocks.length}
          current={current}
          onChange={setCurrent}
          partId={partId}
        />
      </div>
    </div>
  );
}
