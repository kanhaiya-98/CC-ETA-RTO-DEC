"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BrainCircuit,
    PackageSearch,
    Clock4,
    Zap,
} from "lucide-react";

const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/demand", label: "ZenDec", sub: "Decision Engine", icon: BrainCircuit, color: "#4ade80" },
    { href: "/routes", label: "ZenRTO", sub: "RTO Risk Scoring", icon: PackageSearch, color: "#60a5fa" },
    { href: "/eta", label: "ZenETA", sub: "ETA Prediction", icon: Clock4, color: "#fb923c" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            style={{
                width: 240,
                minHeight: "100vh",
                background: "#fff",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                padding: "20px 12px",
                position: "sticky",
                top: 0,
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", marginBottom: 32, display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
                <div
                    style={{
                        width: 32,
                        height: 32,
                        background: "linear-gradient(135deg, #4ade80, #22c55e)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Zap size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        Zen Platform
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        AI Logistics
                    </div>
                </div>
            </Link>

            {/* Nav */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                {nav.map(({ href, label, sub, icon: Icon, color }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link key={href} href={href} className={`sidebar-link${active ? " active" : ""}`}>
                            <span
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    background: active ? "var(--accent-soft)" : "#f4f4f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    transition: "background 150ms",
                                }}
                            >
                                <Icon size={15} color={active ? "var(--accent-text)" : "var(--text-secondary)"} />
                            </span>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                                {sub && (
                                    <div style={{ fontSize: 11, color: active ? "var(--accent-text)" : "var(--text-muted)", fontWeight: 400 }}>
                                        {sub}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
                <div style={{ padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Zen Platform v1.0</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Powered by Fine-Tuned LLM</div>
                </div>
            </div>
        </aside>
    );
}
