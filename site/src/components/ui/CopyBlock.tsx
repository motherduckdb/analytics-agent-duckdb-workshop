"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { theme as md } from "@/lib/theme";

/** Auto-detect language from content */
function detectLang(text: string): string {
  const t = text.trimStart();
  if (t.startsWith("import ") || t.startsWith("from ") || t.startsWith("def ") || t.startsWith("class ") || t.includes("@agent") || t.includes("duckdb.connect"))
    return "python";
  if (t.startsWith("SELECT") || t.startsWith("COMMENT") || t.startsWith("CREATE") || t.startsWith("INSERT") || t.match(/^(FROM|WITH|DESCRIBE|SHOW)\s/i))
    return "sql";
  if (t.startsWith("$") || t.startsWith("#") || t.startsWith("duckdb ") || t.startsWith("python3 ") || t.startsWith("make ") || t.startsWith("npm ") || t.startsWith("ollama ") || t.startsWith("opencode") || t.startsWith("claude") || t.startsWith("fastmcp") || t.startsWith("uv ") || t.startsWith("curl ") || t.startsWith("export ") || t.startsWith("kill "))
    return "bash";
  if (t.startsWith("{") && t.includes('"'))
    return "json";
  return "python";
}

export function CopyBlock({
  text,
  label = "Prompt tip",
  lang,
  highlight,
}: {
  text: string;
  label?: string;
  lang?: string;
  highlight?: number[];
}) {
  const [copied, setCopied] = useState(false);
  const language = lang || detectLang(text);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginTop: 14 }}>
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: md.accent,
              fontFamily: md.titleFont,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 10,
              color: md.muted,
              fontFamily: md.titleFont,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {language}
          </span>
        </div>
      )}
      <div
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          border: `1.5px solid ${md.grid}`,
        }}
      >
        <button
          onClick={copy}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: copied ? md.green : "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 4,
            padding: "3px 10px",
            fontSize: 10,
            cursor: "pointer",
            color: copied ? "white" : "#aaa",
            fontFamily: md.bodyFont,
            transition: "background 0.2s",
            zIndex: 2,
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <Highlight theme={themes.nightOwl} code={text.trim()} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                margin: 0,
                padding: "14px 18px",
                paddingRight: 70,
                fontSize: 13,
                fontFamily: md.titleFont,
                lineHeight: 1.7,
                overflowX: "auto",
                background: md.text,
              }}
            >
              {tokens.map((line, i) => {
                const highlighted = highlight?.includes(i + 1);
                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    style={{
                      ...(highlighted
                        ? { background: "rgba(111,194,255,0.15)", margin: "0 -18px", padding: "0 18px", borderLeft: `3px solid ${md.accent}`, paddingLeft: 15 }
                        : {}),
                    }}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
