"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { theme } from "@/lib/theme";

/* ── Animation config ─────────────────────────────────────────── */

const WIRE_PATHS = {
  w1: "M 213,118 L 376,118", // Chat → LLM
  w2: "M 376,144 L 213,144", // LLM → Chat
  w3: "M 441,172 L 441,390", // LLM → MCP
  w4: "M 501,390 L 501,172", // MCP → LLM
  w5: "M 570,424 L 696,424", // MCP → DB
  w6: "M 696,444 L 570,444", // DB → MCP
};

type WireId = keyof typeof WIRE_PATHS;
type ColorClass = "yellow" | "green" | "red";

const COLORS: Record<ColorClass, string> = {
  yellow: theme.yellow,
  green: theme.green,
  red: theme.red,
};

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/* ── Component ────────────────────────────────────────────────── */

export function AgenticLoop() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const cancelRef = useRef(false);
  const [step, setStep] = useState<{
    num: number;
    text: string;
    status?: "err" | "ok";
  } | null>(null);
  const [lit, setLit] = useState<Set<string>>(new Set());
  const [glows, setGlows] = useState<Record<WireId, { on: boolean; color: ColorClass }>>({
    w1: { on: false, color: "yellow" },
    w2: { on: false, color: "yellow" },
    w3: { on: false, color: "yellow" },
    w4: { on: false, color: "yellow" },
    w5: { on: false, color: "yellow" },
    w6: { on: false, color: "yellow" },
  });
  const [pay, setPay] = useState<{
    text: string;
    x: number;
    y: number;
    status?: "err" | "ok";
  } | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loopVisible, setLoopVisible] = useState(false);
  const [hlRow, setHlRow] = useState(false);
  const [dotColor, setDotColor] = useState<ColorClass>("yellow");
  const [dotVisible, setDotVisible] = useState(false);

  /* helpers */
  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((res) => {
        const check = () => {
          if (cancelRef.current) return;
          res();
        };
        setTimeout(check, ms);
      }),
    [],
  );

  const glow = useCallback((id: WireId, on: boolean, color?: ColorClass) => {
    setGlows((prev) => ({
      ...prev,
      [id]: { on, color: color ?? prev[id].color },
    }));
  }, []);

  const dimAll = useCallback(() => {
    setGlows((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next) as WireId[]) {
        next[k] = { on: false, color: "yellow" };
      }
      return next;
    });
  }, []);

  const light = useCallback(
    (id: string) => setLit((s) => new Set(s).add(id)),
    [],
  );
  const unlight = useCallback(
    (id: string) =>
      setLit((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      }),
    [],
  );

  const ride = useCallback(
    (wireId: WireId, dur: number, payOffset?: { dx: number; dy: number }) => {
      return new Promise<void>((res) => {
        const svg = svgRef.current;
        if (!svg) return res();
        const path = svg.querySelector(`#${wireId}`) as SVGPathElement | null;
        if (!path) return res();

        const len = path.getTotalLength();
        const t0 = performance.now();

        glow(wireId, true);
        setDotVisible(true);

        const tick = (now: number) => {
          if (cancelRef.current) return;
          const raw = Math.min((now - t0) / dur, 1);
          const t = ease(raw);
          const pt = path.getPointAtLength(t * len);

          if (dotRef.current) {
            dotRef.current.setAttribute("cx", String(pt.x));
            dotRef.current.setAttribute("cy", String(pt.y));
          }

          if (payOffset) {
            setPay((prev) =>
              prev ? { ...prev, x: pt.x + payOffset.dx, y: pt.y + payOffset.dy } : prev,
            );
          }

          if (raw < 1) {
            requestAnimationFrame(tick);
          } else {
            res();
          }
        };
        requestAnimationFrame(tick);
      });
    },
    [glow],
  );

  /* ── Animation cycle ──────────────────────────────────────── */
  const cycle = useCallback(async () => {
    // Reset
    dimAll();
    setStep(null);
    setPay(null);
    setAnswer(null);
    setLoopVisible(false);
    setHlRow(false);
    setDotColor("yellow");
    setDotVisible(false);
    setLit(new Set());
    await wait(800);

    // ① User prompt
    setStep({ num: 1, text: "User sends a prompt" });
    light("chat");
    setPay({ text: '"Feed my ducks"', x: 224, y: 100 });
    await wait(1200);

    // ② → LLM
    setStep({ num: 2, text: "Prompt reaches the LLM" });
    setDotColor("yellow");
    await ride("w1", 600, { dx: 14, dy: -22 });
    unlight("chat");
    light("llm");
    await wait(700);

    // ③ LLM picks tool
    setStep({ num: 3, text: "LLM selects feed_ducks_now()" });
    setPay({ text: "feed_ducks_now()", x: 510, y: 200 });
    setLoopVisible(true);
    await wait(1300);

    // ④ LLM → MCP
    setStep({ num: 4, text: "Tool call routed to MCP server" });
    setDotColor("yellow");
    await ride("w3", 650, { dx: 18, dy: -10 });
    unlight("llm");
    light("mcp");
    setPay(null);
    await wait(500);

    // ⑤ MCP → Table (wrong query)
    setStep({ num: 5, text: "MCP queries the database" });
    setPay({ text: "SELECT * FROM duckfeed", x: 565, y: 392 });
    await wait(400);
    setDotColor("yellow");
    await ride("w5", 500, { dx: 10, dy: -22 });
    light("db");
    await wait(400);

    // ⑥ Error
    setStep({ num: 6, text: "Table not found!", status: "err" });
    setPay({ text: "✕ Did you mean pets.duckfeed?", x: 565, y: 456, status: "err" });
    setDotColor("red");
    await wait(1400);

    // ⑦ Error returns
    setStep({ num: 7, text: "Error returned through the loop", status: "err" });
    glow("w6", true, "red");
    await ride("w6", 450, { dx: -220, dy: -22 });
    unlight("db");
    glow("w5", false);
    await wait(150);
    glow("w4", true, "red");
    await ride("w4", 600, { dx: -220, dy: -10 });
    unlight("mcp");
    light("llm");
    glow("w3", false);
    glow("w6", false);
    glow("w4", false);
    await wait(500);

    // ⑧ LLM self-corrects
    setStep({ num: 8, text: "LLM self-corrects → pets.duckfeed" });
    setDotColor("yellow");
    setPay({ text: "SELECT * FROM pets.duckfeed", x: 510, y: 200 });
    await wait(1300);

    // ⑨ Corrected query
    setStep({ num: 9, text: "Corrected query sent" });
    setDotColor("yellow");
    await ride("w3", 600, { dx: 18, dy: -10 });
    unlight("llm");
    light("mcp");
    await wait(200);
    await ride("w5", 500, { dx: 10, dy: -22 });
    light("db");
    setPay(null);
    await wait(350);
    setHlRow(true);
    await wait(900);

    // ⑩ Success returns
    setStep({ num: 10, text: "Data extracted successfully", status: "ok" });
    setDotColor("green");
    setPay({
      text: '{"feed_amount":"50","unit":"grams"}',
      x: 565,
      y: 456,
      status: "ok",
    });
    await wait(500);
    glow("w6", true, "green");
    await ride("w6", 500, { dx: -280, dy: -22 });
    unlight("db");
    glow("w5", false);
    await wait(150);
    glow("w4", true, "green");
    await ride("w4", 600, { dx: -280, dy: -10 });
    unlight("mcp");
    light("llm");
    glow("w3", false);
    glow("w6", false);
    glow("w4", false);
    await wait(600);

    // ⑪ LLM → Chat
    setStep({ num: 11, text: "LLM sends the answer" });
    setPay({ text: '"Ducks fed 50 g each!"', x: 224, y: 150 });
    setDotColor("yellow");
    await ride("w2", 650, { dx: 14, dy: 12 });
    unlight("llm");
    light("chat");
    setAnswer("Ducks fed 50 g each!");
    setDotVisible(false);
    setPay(null);
    await wait(2800);

    dimAll();
    setLoopVisible(false);
    setStep(null);
    await wait(1600);
  }, [wait, ride, glow, dimAll, light, unlight]);

  useEffect(() => {
    cancelRef.current = false;
    let running = true;

    const run = async () => {
      while (running && !cancelRef.current) {
        await cycle();
      }
    };
    run();

    return () => {
      running = false;
      cancelRef.current = true;
    };
  }, [cycle]);

  /* ── Render ───────────────────────────────────────────────── */
  const isLit = (id: string) => lit.has(id);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 960, margin: "16px auto" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "60.4%", /* 580/960 */
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {/* SVG wires + glows + dot */}
          <svg
            ref={svgRef}
            viewBox="0 0 960 580"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={theme.grid} />
              </marker>
            </defs>

            {/* Loop border */}
            <rect
              x="310" y="42" rx="22" ry="22" width="640" height="470"
              fill="none" stroke={theme.muted} strokeWidth={1.5}
              strokeDasharray="8 5" strokeLinecap="round"
              style={{
                opacity: loopVisible ? 1 : 0,
                transition: "opacity 0.5s",
                animation: loopVisible ? "march 0.8s linear infinite" : "none",
              }}
            />
            <text
              x="760" y="34"
              fontFamily={theme.titleFont} fontSize={12} fontStyle="italic"
              fill={theme.muted}
              style={{ opacity: loopVisible ? 1 : 0, transition: "opacity 0.5s" }}
            >
              Agentic Loop
            </text>

            {/* Static wires */}
            {(Object.entries(WIRE_PATHS) as [WireId, string][]).map(([id, d]) => (
              <path key={id} id={id} d={d} fill="none" stroke={theme.grid}
                strokeWidth={2} strokeLinecap="round" markerEnd="url(#ah)" />
            ))}

            {/* Glow wires */}
            {(Object.entries(WIRE_PATHS) as [WireId, string][]).map(([id, d]) => (
              <path
                key={`g-${id}`}
                d={d}
                fill="none"
                stroke={COLORS[glows[id].color]}
                strokeWidth={3.5}
                strokeLinecap="round"
                style={{ opacity: glows[id].on ? 1 : 0, transition: "opacity 0.3s" }}
              />
            ))}

            {/* Animated dot */}
            <circle
              ref={dotRef}
              r={6}
              fill={COLORS[dotColor]}
              style={{
                opacity: dotVisible ? 1 : 0,
                filter: `drop-shadow(0 0 6px ${COLORS[dotColor]}99)`,
                transition: "fill 0.2s, filter 0.2s",
              }}
            />
          </svg>

          {/* Chat node */}
          <div
            style={{
              position: "absolute",
              left: "3.96%", top: "9.48%",
              width: "18.23%", height: "23.1%",
              background: "#fff",
              border: `2px solid ${theme.text}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "box-shadow 0.3s, transform 0.3s",
              ...(isLit("chat") ? { transform: "scale(1.03)", boxShadow: `0 0 0 4px ${theme.text}1f` } : {}),
            }}
          >
            <div
              style={{
                height: 30,
                background: theme.yellow,
                borderBottom: `2px solid ${theme.text}`,
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                gap: 5,
              }}
            >
              <i style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: theme.text, opacity: 0.25 }} />
              <i style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: theme.text, opacity: 0.25 }} />
              <i style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: theme.text, opacity: 0.25 }} />
            </div>
            <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontSize: 10,
                  padding: "5px 8px",
                  borderRadius: "8px 8px 2px 8px",
                  background: theme.snow,
                  alignSelf: "flex-end",
                  fontFamily: theme.titleFont,
                }}
              >
                Feed my ducks
              </div>
              {answer && (
                <div
                  style={{
                    fontSize: 10,
                    padding: "5px 8px",
                    borderRadius: "8px 8px 8px 2px",
                    background: theme.yellow,
                    alignSelf: "flex-start",
                    fontFamily: theme.titleFont,
                  }}
                >
                  {answer}
                </div>
              )}
            </div>
          </div>

          {/* LLM node */}
          <div
            style={{
              position: "absolute",
              left: "38.75%", top: "14.14%",
              width: "20.63%", height: "15.17%",
              background: theme.yellow,
              border: `2px solid ${theme.text}`,
              borderRadius: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: theme.titleFont,
              transition: "box-shadow 0.3s, transform 0.3s",
              ...(isLit("llm") ? { transform: "scale(1.03)", boxShadow: `0 0 0 4px ${theme.yellow}4d` } : {}),
            }}
          >
            LLM
            <span style={{ fontWeight: 400, fontSize: 11, color: theme.muted, marginTop: 2 }}>
              Anthropic, OpenAI
            </span>
          </div>

          {/* MCP node */}
          <div
            style={{
              position: "absolute",
              left: "38.75%", top: "67.24%",
              width: "20.63%", height: "15.17%",
              transition: "transform 0.3s",
              ...(isLit("mcp") ? { transform: "scale(1.03)" } : {}),
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: theme.green,
                clipPath: "polygon(12% 0%, 88% 0%, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0% 70%, 0% 30%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                fontFamily: theme.titleFont,
              }}
            >
              MCP Server
              <span style={{ fontWeight: 400, fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                Tool Call
              </span>
            </div>
          </div>

          {/* DB table node */}
          <div
            style={{
              position: "absolute",
              left: "72.71%", top: "63.79%",
              width: "21.88%",
              transition: "transform 0.3s",
              ...(isLit("db") ? { transform: "scale(1.03)" } : {}),
            }}
          >
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 4, fontFamily: theme.titleFont }}>
              pets.duckfeed
            </div>
            <table
              style={{
                width: "100%",
                fontSize: 11,
                borderCollapse: "separate",
                borderSpacing: 0,
                border: `1.5px solid ${theme.grid}`,
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
                fontFamily: theme.bodyFont,
              }}
            >
              <thead>
                <tr>
                  <th style={{ background: theme.snow, padding: "5px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: theme.muted }}>duck</th>
                  <th style={{ background: theme.snow, padding: "5px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: theme.muted }}>grams</th>
                  <th style={{ background: theme.snow, padding: "5px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: theme.muted }}>fed_at</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>Daisy</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>50</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>08:00</td></tr>
                <tr style={hlRow ? { background: `${theme.yellow}66`, fontWeight: 700, transition: "background 0.3s" } : { transition: "background 0.3s" }}><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>Donald</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>50</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>08:00</td></tr>
                <tr><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>Huey</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>35</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>09:15</td></tr>
                <tr><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>Dewey</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>35</td><td style={{ padding: "4px 10px", borderTop: `1px solid ${theme.snow}` }}>09:15</td></tr>
              </tbody>
            </table>
          </div>

          {/* Floating payload */}
          {pay && (
            <div
              style={{
                position: "absolute",
                left: pay.x,
                top: pay.y,
                fontSize: 11,
                lineHeight: 1.4,
                color: pay.status === "err" ? "#b33a2e" : pay.status === "ok" ? "#0e7e6f" : theme.text,
                background: pay.status === "err" ? "#fff6f5" : pay.status === "ok" ? "#f0fdfb" : "#fff",
                border: `1.5px solid ${pay.status === "err" ? theme.red : pay.status === "ok" ? theme.green : theme.grid}`,
                borderRadius: 5,
                padding: "3px 9px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                fontFamily: theme.titleFont,
                zIndex: 15,
              }}
            >
              {pay.text}
            </div>
          )}
        </div>
      </div>

      {/* Step indicator */}
      {step && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, height: 24 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: step.status === "err" ? theme.red : step.status === "ok" ? theme.green : theme.text,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: theme.titleFont,
            }}
          >
            {step.num}
          </span>
          <span style={{ fontSize: 12, color: theme.muted, fontFamily: theme.bodyFont }}>
            {step.text}
          </span>
        </div>
      )}

      {/* CSS animation for marching ants */}
      <style>{`
        @keyframes march { to { stroke-dashoffset: -26; } }
      `}</style>
    </div>
  );
}
