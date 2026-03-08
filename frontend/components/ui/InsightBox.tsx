import { Sparkles } from "lucide-react";

interface InsightBoxProps {
    text: string;
    loading?: boolean;
    title?: string;
}

export default function InsightBox({ text, loading, title = "AI Insights" }: InsightBoxProps) {
    return (
        <div className="insight-box">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Sparkles size={14} color="#16a34a" />
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#16a34a" }}>
                    {title}
                </span>
            </div>
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[100, 85, 60].map((w, i) => (
                        <div
                            key={i}
                            style={{
                                height: 12,
                                width: `${w}%`,
                                background: "#bbf7d0",
                                borderRadius: 6,
                                animation: "pulse-soft 1.5s ease infinite",
                                animationDelay: `${i * 200}ms`,
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{text || "No insights available."}</p>
            )}
        </div>
    );
}
