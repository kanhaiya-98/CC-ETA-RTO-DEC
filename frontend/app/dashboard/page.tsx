"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BrainCircuit, PackageSearch, Clock4, Activity, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { fetchHealth, fetchRouteStats } from "@/lib/api";

const modules = [
    {
        name: "ZenDec",
        sub: "Decision Engine",
        href: "/demand",
        icon: BrainCircuit,
        color: "#4ade80",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        desc: "TOPSIS carrier scoring, AQI enrichment, and HITL approval.",
        cta: "Run Decision",
    },
    {
        name: "ZenRTO",
        sub: "RTO Risk Scoring",
        href: "/routes",
        icon: PackageSearch,
        color: "#60a5fa",
        bg: "#eff6ff",
        border: "#bfdbfe",
        desc: "LightGBM RTO risk + SHAP explainability + fraud detection.",
        cta: "Score Order",
    },
    {
        name: "ZenETA",
        sub: "ETA Prediction",
        href: "/eta",
        icon: Clock4,
        color: "#fb923c",
        bg: "#fff7ed",
        border: "#fed7aa",
        desc: "XGBoost + Chronos-2 ETA with p50/p90/p99 confidence bands.",
        cta: "Predict ETA",
    },
];

export default function DashboardPage() {
    const [health, setHealth] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [healthy, setHealthy] = useState<boolean | null>(null);

    useEffect(() => {
        fetchHealth()
            .then((h) => { setHealth(h); setHealthy(h.status === "ok"); })
            .catch(() => setHealthy(false));
        fetchRouteStats().then(setStats).catch(() => { });
    }, []);

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Navbar title="Dashboard" breadcrumb="Zen Platform" />

            <main style={{ flex: 1, padding: "32px 32px", overflowY: "auto" }}>

                {/* Header */}
                <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px", color: "var(--text-primary)" }}>
                        Good morning 👋
                    </h1>
                    <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
                        Here's a live overview of all three Zen Platform modules.
                    </p>
                </div>

                {/* API Health Banner */}
                <div className="animate-fade-up" style={{ marginBottom: 28 }}>
                    {healthy === null ? (
                        <div style={{ padding: "12px 16px", background: "#f4f4f5", borderRadius: 10, fontSize: 13, color: "var(--text-muted)" }}>
                            Checking backend status…
                        </div>
                    ) : healthy ? (
                        <div style={{
                            padding: "12px 16px", background: "var(--accent-soft)", border: "1px solid #bbf7d0",
                            borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <CheckCircle2 size={16} color="#16a34a" />
                            <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>
                                Backend online · XGBoost {health?.xgboost_loaded ? "loaded" : "not loaded"} · Chronos {health?.chronos_loaded ? "loaded" : "not loaded"}
                            </span>
                        </div>
                    ) : (
                        <div style={{
                            padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca",
                            borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <AlertTriangle size={16} color="#dc2626" />
                            <span style={{ fontSize: 13, color: "#b91c1c", fontWeight: 500 }}>
                                Backend offline — start with: <code style={{ background: "#fee2e2", padding: "2px 6px", borderRadius: 4 }}>uvicorn main:app --reload</code>
                            </span>
                        </div>
                    )}
                </div>

                {/* Stats row */}
                {stats && (
                    <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                        {[
                            { label: "Total Orders Scored", value: stats.total_orders ?? 0 },
                            { label: "Avg RTO Score", value: stats.avg_rto_score != null ? `${(stats.avg_rto_score * 100).toFixed(1)}%` : "—" },
                            { label: "High Risk Orders", value: `${((stats.high_risk_pct || 0) * 100).toFixed(1)}%` },
                            { label: "Fraud Flagged", value: stats.fraud_flagged ?? 0 },
                        ].map((s) => (
                            <div key={s.label} className="card">
                                <div className="stat-label">{s.label}</div>
                                <div className="stat-value" style={{ marginTop: 8 }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Module Cards */}
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                    Modules
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {modules.map((m, i) => (
                        <div
                            key={m.name}
                            className="card card-hover animate-fade-up"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: m.bg, border: `1px solid ${m.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <m.icon size={20} color={m.color} />
                                </div>
                                <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{m.sub}</div>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>{m.desc}</p>
                            <Link href={m.href} className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                                {m.cta} <ArrowRight size={13} />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                    Quick Actions
                </h2>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Link href="/demand" className="btn btn-primary">Run carrier decision</Link>
                    <Link href="/routes" className="btn btn-secondary">Score a COD order</Link>
                    <Link href="/eta" className="btn btn-secondary">Predict shipment ETA</Link>
                    <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        <Activity size={14} /> View API docs
                    </a>
                </div>
            </main>
        </div>
    );
}
