import { theme } from "@/lib/theme";

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 16,
        marginBottom: 16,
        padding: "10px 14px",
        background: `${theme.accent}12`,
        borderLeft: `3px solid ${theme.accent}`,
        borderRadius: "0 6px 6px 0",
        fontSize: 13,
        color: theme.text,
        lineHeight: 1.5,
        fontFamily: theme.bodyFont,
      }}
    >
      {children}
    </div>
  );
}
