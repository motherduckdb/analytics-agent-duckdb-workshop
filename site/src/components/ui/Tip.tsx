import { theme } from "@/lib/theme";

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 18,
        marginBottom: 18,
        padding: "14px 18px",
        background: `${theme.accent}12`,
        borderLeft: `3px solid ${theme.accent}`,
        borderRadius: "0 8px 8px 0",
        fontSize: 16,
        color: theme.text,
        lineHeight: 1.5,
        fontFamily: theme.bodyFont,
      }}
    >
      {children}
    </div>
  );
}
