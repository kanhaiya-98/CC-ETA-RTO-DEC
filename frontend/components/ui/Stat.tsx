import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatProps {
    label: string;
    value: string | number;
    sub?: string;
    trend?: "up" | "down" | "flat";
    accent?: boolean;
}

export default function Stat({ label, value, sub, trend, accent }: StatProps) {
    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    const trendColor = trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "var(--text-muted)";

    return (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={accent ? { color: "var(--accent-text)" } : {}}>
                {value}
            </div>
            {(sub || trend) && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    {trend && <TrendIcon size={13} color={trendColor} />}
                    {sub && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</span>}
                </div>
            )}
        </div>
    );
}
