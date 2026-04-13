import { theme } from "@/lib/theme";

export function Badge({
  children,
  color = theme.accent,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        background: `${color}22`,
        color,
        fontFamily: theme.bodyFont,
      }}
    >
      {children}
    </span>
  );
}
