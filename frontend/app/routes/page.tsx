"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import InsightBox from "@/components/ui/InsightBox";
import Badge from "@/components/ui/Badge";
import { scoreOrder, OrderScoreRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PackageSearch, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

function riskVariant(risk: string): "green" | "amber" | "red" | "zinc" {
    const r = (risk || "").toUpperCase();
    if (r === "LOW") return "green";
    if (r === "MEDIUM") return "amber";
    if (r === "HIGH" || r === "CRITICAL") return "red";
    return "zinc";
}

export default function RoutesPage() {
    const [form, setForm] = useState<OrderScoreRequest>({
        order_id: "ORD-20240301-001",
        buyer_id: "BUY-12345",
        pincode: "110091",
        address_raw: "Flat 4B, Green Enclave, Sector 7, Delhi 110091",
        payment_method: "COD",
        order_value: 1200,
        product_category: "GENERAL",
        device_type: "MOBILE",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await scoreOrder(form);
            setResult(res);
        } catch (err: any) {
            setError(err.message || "Failed to score order. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Navbar title="RTO Risk Scoring" breadcrumb="ZenRTO" />

            <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>

                    {/* Header */}
                    <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 32 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <PackageSearch size={18} color="#60a5fa" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: "var(--text-primary)" }}>ZenRTO — RTO Risk Scoring</h1>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                                LightGBM-powered return-to-origin fraud detection with SHAP explainability. Score COD orders before dispatch.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="card animate-fade-up">
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px" }}>Order Details</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {[
                                        ["order_id", "Order ID", "text"],
                                        ["buyer_id", "Buyer ID", "text"],
                                        ["pincode", "Pincode", "text"],
                                        ["address_raw", "Delivery Address", "text"],
                                        ["order_value", "Order Value (₹)", "number"],
                                    ].map(([field, label, type]) => (
                                        <label key={field} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            {label}
                                            <input
                                                className="input"
                                                style={{ marginTop: 6 }}
                                                type={type}
                                                value={(form as any)[field]}
                                                onChange={(e) => setForm((f) => ({ ...f, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                                            />
                                        </label>
                                    ))}

                                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                        Payment Method
                                        <select className="input" style={{ marginTop: 6 }} value={form.payment_method} onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}>
                                            <option value="COD">COD</option>
                                            <option value="PREPAID">Prepaid</option>
                                            <option value="CARD">Card</option>
                                        </select>
                                    </label>

                                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                        Device Type
                                        <select className="input" style={{ marginTop: 6 }} value={form.device_type} onChange={(e) => setForm((f) => ({ ...f, device_type: e.target.value }))}>
                                            <option value="MOBILE">Mobile</option>
                                            <option value="DESKTOP">Desktop</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                                {loading ? "Scoring order…" : "Score RTO Risk"}
                            </button>
                        </form>

                        {/* Right: results */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                            {error && (
                                <div style={{ padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
                                    <AlertTriangle size={16} color="#dc2626" />
                                    <span style={{ fontSize: 14, color: "#b91c1c" }}>{error}</span>
                                </div>
                            )}

                            {!result && !error && (
                                <div className="card" style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: 14 }}>
                                    <PackageSearch size={32} color="#d4d4d8" style={{ margin: "0 auto 16px" }} />
                                    Submit an order on the left to see RTO risk score.
                                </div>
                            )}

                            {result && (
                                <>
                                    {/* Score card */}
                                    <div className="card animate-fade-up" style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center" }}>
                                        {/* Gauge */}
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{
                                                width: 100, height: 100, borderRadius: "50%",
                                                background: `conic-gradient(${result.risk_level === "LOW" ? "#4ade80" : result.risk_level === "MEDIUM" ? "#fb923c" : "#f87171"} ${result.rto_score * 360}deg, #f4f4f5 0deg)`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                boxShadow: "inset 0 0 0 14px #fff",
                                                margin: "0 auto 8px",
                                            }}>
                                                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
                                                    {(result.rto_score * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="stat-label">RTO Score</div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                                            <div style={{ display: "flex", gap: 16 }}>
                                                <div>
                                                    <div className="stat-label">Risk Level</div>
                                                    <div style={{ marginTop: 6 }}>
                                                        <Badge variant={riskVariant(result.risk_level)} dot>{result.risk_level}</Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="stat-label">Action Taken</div>
                                                    <div style={{ marginTop: 6 }}>
                                                        <Badge variant={result.action_taken?.includes("APPROVE") ? "green" : "amber"}>
                                                            {result.action_taken?.replace(/_/g, " ")}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="stat-label">Savings Estimate</div>
                                                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent-text)", marginTop: 6 }}>
                                                        {formatCurrency(result.savings_estimate_rs || 0)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="stat-label">City</div>
                                                <div style={{ fontSize: 14, color: "var(--text-primary)", marginTop: 4 }}>{result.pincode_city || result.pincode}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fraud flags */}
                                    {result.fraud_flags?.length > 0 && (
                                        <div className="card animate-fade-up" style={{ borderColor: "#fecaca", background: "#fef2f2" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                                                <ShieldAlert size={15} color="#dc2626" />
                                                <span style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>Fraud Flags Detected</span>
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                {result.fraud_flags.map((f: any, i: number) => {
                                                    const label = String(f).replace(/_/g, " ");
                                                    return <Badge key={`${label}-${i}`} variant="red">{label}</Badge>;
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* SHAP factors */}
                                    {result.top_risk_factors?.length > 0 && (
                                        <div className="card animate-fade-up">
                                            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px" }}>Top Risk Factors (SHAP)</h3>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                {result.top_risk_factors.slice(0, 6).map((f: any) => {
                                                    const isRisk = f.direction === "INCREASES_RISK";
                                                    const shap = Math.abs(f.shap_value || 0);
                                                    return (
                                                        <div key={f.feature} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                            <div style={{ width: 16, color: isRisk ? "#dc2626" : "#16a34a", fontWeight: 700, fontSize: 14, textAlign: "center" }}>
                                                                {isRisk ? "↑" : "↓"}
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{f.display_name || f.feature}</span>
                                                                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{shap.toFixed(3)}</span>
                                                                </div>
                                                                <div className="progress-bar">
                                                                    <div className="progress-fill" style={{ width: `${Math.min(shap * 200, 100)}%`, background: isRisk ? "#f87171" : "#4ade80" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* AI Risk Explanation */}
                                    <InsightBox title="ZenRTO — AI Risk Explanation" text={result.explanation || "No explanation generated."} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
