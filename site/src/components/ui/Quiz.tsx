"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

export function Quiz({
  question,
  options,
  correct,
  explanation,
}: {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === correct;

  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 24,
        padding: 20,
        background: theme.surface,
        border: `1.5px solid ${theme.grid}`,
        borderRadius: 8,
        fontFamily: theme.bodyFont,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: theme.accent,
          fontFamily: theme.titleFont,
          margin: "0 0 8px 0",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Quick check
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: theme.text,
          margin: "0 0 12px 0",
        }}
      >
        {question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt, i) => {
          const isThis = selected === i;
          const showCorrect = answered && i === correct;
          const showWrong = answered && isThis && !isCorrect;

          let bg: string = theme.snow;
          let border: string = theme.grid;
          if (showCorrect) {
            bg = `${theme.green}18`;
            border = theme.green;
          }
          if (showWrong) {
            bg = `${theme.red}18`;
            border = theme.red;
          }

          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 6,
                cursor: answered ? "default" : "pointer",
                fontSize: 13,
                color: theme.text,
                textAlign: "left",
                fontFamily: theme.bodyFont,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${showCorrect ? theme.green : showWrong ? theme.red : theme.muted}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: showCorrect ? theme.green : showWrong ? theme.red : theme.muted,
                  flexShrink: 0,
                }}
              >
                {showCorrect ? "✓" : showWrong ? "✕" : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && explanation && (
        <p
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: isCorrect ? `${theme.green}10` : `${theme.red}10`,
            borderRadius: 6,
            fontSize: 12,
            color: theme.text,
            lineHeight: 1.5,
          }}
        >
          {isCorrect ? "Correct! " : "Not quite. "}
          {explanation}
        </p>
      )}
    </div>
  );
}
