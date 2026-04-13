"use client";

import { useState, useEffect, useCallback } from "react";
import { theme } from "@/lib/theme";
import { asset } from "@/lib/asset";

export function Exercise({
  title = "Hands-on",
  minutes = 5,
  children,
}: {
  title?: string;
  minutes?: number;
  children?: React.ReactNode;
}) {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(minutes * 60);

  useEffect(() => {
    if (!running || left <= 0) return;
    const id = setInterval(() => setLeft((l) => Math.max(l - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [running, left]);

  const toggle = useCallback(() => {
    if (!running) {
      setLeft(minutes * 60);
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [running, minutes]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = left / (minutes * 60);
  const urgent = pct < 0.2 && running;

  return (
    <div
      style={{
        margin: "24px 0",
        padding: "18px 20px",
        background: `${theme.yellow}14`,
        border: `2px solid ${theme.yellow}`,
        borderRadius: 10,
        fontFamily: theme.bodyFont,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: children ? 12 : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={asset("/exercise-duck.png")}
            alt=""
            aria-hidden
            style={{
              width: 72,
              height: 72,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                fontFamily: theme.titleFont,
                color: theme.text,
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 12,
                color: theme.muted,
                marginLeft: 8,
              }}
            >
              {minutes} min
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: theme.titleFont,
              fontSize: 20,
              fontWeight: 700,
              color: urgent ? theme.red : running ? theme.text : theme.muted,
              minWidth: 64,
              textAlign: "center",
              transition: "color 0.3s",
            }}
          >
            {mm}:{ss}
          </span>
          <button
            onClick={toggle}
            style={{
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: theme.titleFont,
              border: `1.5px solid ${theme.grid}`,
              borderRadius: 6,
              background: running ? theme.surface : theme.yellow,
              color: running ? theme.muted : theme.text,
              cursor: "pointer",
            }}
          >
            {running ? (left === 0 ? "Done" : "Stop") : "Start"}
          </button>
        </div>
      </div>

      {/* progress bar */}
      {running && (
        <div
          style={{
            height: 3,
            background: theme.grid,
            borderRadius: 2,
            marginBottom: children ? 12 : 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: urgent ? theme.red : theme.yellow,
              borderRadius: 2,
              transition: "width 1s linear, background 0.3s",
            }}
          />
        </div>
      )}

      {children && (
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
          {children}
        </div>
      )}
    </div>
  );
}
