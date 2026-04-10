export const theme = {
  bg: "#F4EFEA",
  surface: "#FFFFFF",
  text: "#383838",
  muted: "#A1A1A1",
  accent: "#6FC2FF",
  green: "#16AA98",
  yellow: "#FFDE00",
  red: "#FF7169",
  grid: "#E8E3DE",
  snow: "#F8F7F7",
  titleFont: "'Space Mono', 'Space Grotesk', monospace",
  bodyFont: "'Inter', system-ui, sans-serif",
} as const;

export const PALETTE = [
  "#0777b3",
  "#bd4e35",
  "#2d7a00",
  "#e18727",
  "#638CAD",
  "#adadad",
];

export const PARTS = [
  { id: "setup", label: "Setup", tagline: "5 min", file: "00-setup" },
  { id: "duckdb", label: "DuckDB", tagline: "10 min", file: "01-duckdb" },
  { id: "loop", label: "The Loop", tagline: "15 min", file: "02-agentic-loop" },
  { id: "context", label: "Context", tagline: "15 min", file: "03-context" },
  { id: "tools", label: "Tools", tagline: "20 min", file: "04-tools" },
  { id: "mcp", label: "MCP", tagline: "15 min", file: "05-mcp" },
] as const;
