"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import InsightBox from "@/components/ui/InsightBox";
import Badge from "@/components/ui/Badge";
import { runDecision, CarrierInput, updatePolicy } from "@/lib/api";
import { formatCurrency, riskColor } from "@/lib/utils";
import { Plus, Trash2, Zap, BrainCircuit, AlertTriangle } from "lucide-react";

type VehicleType = "road-diesel" | "road-ev" | "rail" | "air";

function emptyCarrier(n: number): CarrierInput {
    return {
        carrier_id: `C${n}`,
        carrier_name: "",
        route: "DEL-BOM",
        vehicle_type: "road-diesel",
        cost_inr: 5000,
        cost_delta: 0,
        eta_hours: 24,
        eta_delta: 0,
        distance_km: 1400,
        weight_tonnes: 0.5,
        sla_breach_prob: 0.05,
        historical_breach_rate: 0,
    };
}

function riskBadgeVariant(tier: string) {
    if (!tier) return "zinc";
    const t = tier.toUpperCase();
    if (t.includes("AUTO")) return "green";
    if (t.includes("PARETO")) return "amber";
    if (t.includes("ESCALATE")) return "red";
    return "zinc";
}

export default function DemandPage() {
    const [carriers, setCarriers] = useState<CarrierInput[]>([emptyCarrier(1), emptyCarrier(2), emptyCarrier(3)]);
    const [blastRadius, setBlastRadius] = useState(5);
    const [confidence, setConfidence] = useState(80);
    const [city, setCity] = useState("delhi");
    const [policy, setPolicy] = useState("BALANCED");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    function updateCarrier(i: number, field: keyof CarrierInput, value: any) {
        setCarriers((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
    }

    function addCarrier() {
        setCarriers((prev) => [...prev, emptyCarrier(prev.length + 1)]);
    }

    function removeCarrier(i: number) {
        if (carriers.length <= 3) return;
        setCarriers((prev) => prev.filter((_, idx) => idx !== i));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            // Set policy first
            await updatePolicy(policy).catch(() => { });
            const res = await runDecision({ blast_radius: blastRadius, confidence, city, carriers });
            setResult(res);
        } catch (err: any) {
            setError(err.message || "Failed to run decision. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Navbar title="Decision Engine" breadcrumb="ZenDec" />

            <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    {/* Header */}
                    <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <BrainCircuit size={18} color="var(--accent-text)" />
                                </div>
                                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "var(--text-primary)" }}>ZenDec — Decision Engine</h1>
                            </div>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                                Multi-objective TOPSIS carrier selection with AQI enrichment and autonomy tier evaluation.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>

                            {/* Left: settings */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div className="card animate-fade-up">
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Incident Context</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            City (AQI lookup)
                                            <input className="input" style={{ marginTop: 6 }} value={city} onChange={(e) => setCity(e.target.value)} placeholder="delhi" />
                                        </label>
                                        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            Blast Radius (shipments affected)
                                            <input className="input" style={{ marginTop: 6 }} type="number" min={1} max={1000} value={blastRadius} onChange={(e) => setBlastRadius(Number(e.target.value))} />
                                        </label>
                                        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            Model Confidence (0–100)
                                            <input className="input" style={{ marginTop: 6 }} type="number" min={0} max={100} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
                                        </label>
                                        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            Routing Policy
                                            <select className="input" style={{ marginTop: 6 }} value={policy} onChange={(e) => setPolicy(e.target.value)}>
                                                <option value="BALANCED">BALANCED</option>
                                                <option value="COST_FIRST">COST_FIRST</option>
                                                <option value="SPEED_FIRST">SPEED_FIRST</option>
                                                <option value="CARBON_FIRST">CARBON_FIRST</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                                    {loading ? "Running TOPSIS…" : <><Zap size={16} /> Run Decision</>}
                                </button>
                            </div>

                            {/* Right: carriers */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Carrier Options <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(min 3)</span></h3>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={addCarrier}><Plus size={13} /> Add</button>
                                </div>

                                {carriers.map((c, i) => (
                                    <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Carrier {i + 1}</span>
                                            {carriers.length > 3 && (
                                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeCarrier(i)} style={{ color: "#dc2626", padding: 4 }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                            {[
                                                ["carrier_name", "Carrier Name", "text", "BlueDart"],
                                                ["route", "Route", "text", "DEL-BOM"],
                                                ["cost_inr", "Cost (₹)", "number", "5000"],
                                                ["eta_hours", "ETA Hours", "number", "24"],
                                                ["distance_km", "Distance (km)", "number", "1400"],
                                                ["weight_tonnes", "Weight (t)", "number", "0.5"],
                                            ].map(([field, label, type, placeholder]) => (
                                                <label key={field as string} style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
                                                    {label as string}
                                                    <input
                                                        className="input"
                                                        style={{ marginTop: 4, fontSize: 13 }}
                                                        type={type as string}
                                                        placeholder={placeholder as string}
                                                        value={(c as any)[field as string]}
                                                        onChange={(e) => updateCarrier(i, field as keyof CarrierInput, type === "number" ? Number(e.target.value) : e.target.value)}
                                                    />
                                                </label>
                                            ))}
                                            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", gridColumn: "span 2" }}>
                                                Vehicle Type
                                                <select className="input" style={{ marginTop: 4, fontSize: 13 }} value={c.vehicle_type} onChange={(e) => updateCarrier(i, "vehicle_type", e.target.value)}>
                                                    <option value="road-diesel">Road – Diesel</option>
                                                    <option value="road-ev">Road – EV</option>
                                                    <option value="rail">Rail</option>
                                                    <option value="air">Air</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Error */}
                    {error && (
                        <div style={{ marginTop: 24, padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
                            <AlertTriangle size={16} color="#dc2626" />
                            <span style={{ fontSize: 14, color: "#b91c1c" }}>{error}</span>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="animate-fade-up" style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                            <div className="divider" />

                            {/* Autonomy tier */}
                            <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                                <div>
                                    <div className="stat-label">Autonomy Tier</div>
                                    <div style={{ marginTop: 6 }}>
                                        <Badge variant={riskBadgeVariant(result.autonomy_tier) as any} dot>
                                            {result.autonomy_tier}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <div className="stat-label">Routing Policy</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 6 }}>{result.policy}</div>
                                </div>
                                <div>
                                    <div className="stat-label">AQI — {result.aqi_data?.city}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: result.aqi_data?.aqi > 150 ? "#dc2626" : "var(--accent-text)", marginTop: 6 }}>
                                        {result.aqi_data?.aqi ?? "—"}
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="stat-label">Reason</div>
                                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>{result.autonomy_reason}</div>
                                </div>
                            </div>

                            {/* Pareto options */}
                            <div className="card">
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>Pareto Optimal Carriers</h3>
                                <table className="zen-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Carrier</th>
                                            <th>Route</th>
                                            <th>Vehicle</th>
                                            <th>TOPSIS Score</th>
                                            <th>Cost</th>
                                            <th>ETA</th>
                                            <th>CO₂ (kg)</th>
                                            <th>Stress Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.pareto_options?.map((opt: any, i: number) => (
                                            <tr key={opt.carrier_id}>
                                                <td>
                                                    <span style={{ fontWeight: 700, color: i === 0 ? "var(--accent-text)" : "var(--text-muted)" }}>#{i + 1}</span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{opt.carrier_name}</td>
                                                <td>{opt.route}</td>
                                                <td><Badge variant="zinc">{opt.vehicle_type}</Badge></td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <div className="progress-bar" style={{ width: 60 }}>
                                                            <div className="progress-fill" style={{ width: `${(opt.topsis_score || 0) * 100}%`, background: i === 0 ? "#4ade80" : "#d4d4d8" }} />
                                                        </div>
                                                        <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{((opt.topsis_score || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(opt.cost_inr)}</td>
                                                <td style={{ fontVariantNumeric: "tabular-nums" }}>{opt.eta_hours}h</td>
                                                <td style={{ fontVariantNumeric: "tabular-nums" }}>{opt.co2_kg?.toFixed(1) ?? "—"}</td>
                                                <td>
                                                    <Badge variant={opt.stress_score > 0.66 ? "green" : opt.stress_score > 0.33 ? "amber" : "red"}>
                                                        {((opt.stress_score || 0) * 100).toFixed(0)}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* AI Insights */}
                            <InsightBox
                                title="ZenDec — AI Decision Insights"
                                text={result.gemini_insights || "No insights generated."}
                            />

                            {/* Counterfactuals */}
                            {result.counterfactuals && (
                                <div className="card">
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px" }}>Counterfactual Explanation</h4>
                                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{result.counterfactuals}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
