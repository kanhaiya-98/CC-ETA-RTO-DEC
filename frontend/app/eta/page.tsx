"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import InsightBox from "@/components/ui/InsightBox";
import Badge from "@/components/ui/Badge";
import { predictETA, predictChronos, ETARequest } from "@/lib/api";
import { formatMinutes } from "@/lib/utils";
import { Clock4, AlertTriangle, Zap } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

export default function ETAPage() {
    const [form, setForm] = useState<ETARequest>({
        shipment_id: "SHIP-001",
        route_distance_km: 500,
        carrier_id: "CAR-01",
        region: "north",
        hour: new Date().getHours(),
        dow: new Date().getDay(),
        warehouse_throughput_15min: 100,
        aqi_speed_multiplier: 1.0,
        lane_avg_delay_30d: 15,
        sla_deadline_minutes: 480,
        origin_lat: 28.6139,
        origin_lon: 77.2090,
        dest_lat: 19.076,
        dest_lon: 72.8777,
    });

    const [chronosInput, setChronosInput] = useState("300, 320, 290, 310, 350, 280, 315");
    const [loading, setLoading] = useState(false);
    const [chronosLoading, setChronosLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [chronosResult, setChronosResult] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await predictETA(form);
            setResult(res);
        } catch (err: any) {
            setError(err.message || "Failed to predict ETA. Is the backend running and XGBoost model trained?");
        } finally {
            setLoading(false);
        }
    }

    async function handleChronos() {
        setChronosLoading(true);
        try {
            const times = chronosInput.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
            const res = await predictChronos({ shipment_id: form.shipment_id, historical_transit_times: times });
            setChronosResult(res);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setChronosLoading(false);
        }
    }

    const slaBreached = result && result.sla_breach_prob > 0.5;

    // Build chart data from Chronos forecast
    const chartData = chronosResult?.chronos_forecast?.map((v: number, i: number) => ({
        step: `T+${i + 1}`,
        forecast: Math.round(v),
    })) ?? [];

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Navbar title="ETA Prediction" breadcrumb="ZenETA" />

            <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    {/* Header */}
                    <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 32 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Clock4 size={18} color="#fb923c" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: "var(--text-primary)" }}>ZenETA — ETA Prediction</h1>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                                XGBoost + Chronos-2, live weather enrichment, and p50/p90/p99 confidence intervals with SLA breach probability.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>

                        {/* Left: form */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div className="card animate-fade-up">
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 16px" }}>Shipment Details</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {[
                                            ["shipment_id", "Shipment ID", "text"],
                                            ["route_distance_km", "Distance (km)", "number"],
                                            ["carrier_id", "Carrier ID", "text"],
                                            ["sla_deadline_minutes", "SLA Deadline (min)", "number"],
                                            ["lane_avg_delay_30d", "Lane Avg Delay 30d (min)", "number"],
                                            ["warehouse_throughput_15min", "Warehouse Throughput/15min", "number"],
                                            ["aqi_speed_multiplier", "AQI Speed Multiplier", "number"],
                                            ["hour", "Hour of Day (0–23)", "number"],
                                        ].map(([field, label, type]) => (
                                            <label key={field} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                                {label}
                                                <input
                                                    className="input"
                                                    style={{ marginTop: 6 }}
                                                    type={type}
                                                    step={type === "number" ? "any" : undefined}
                                                    value={(form as any)[field]}
                                                    onChange={(e) => setForm((f) => ({ ...f, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                                                />
                                            </label>
                                        ))}
                                        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                            Region
                                            <select className="input" style={{ marginTop: 6 }} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}>
                                                <option value="north">North</option>
                                                <option value="south">South</option>
                                                <option value="east">East</option>
                                                <option value="west">West</option>
                                                <option value="central">Central</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                                    {loading ? "Predicting…" : <><Zap size={16} /> Predict ETA</>}
                                </button>
                            </form>

                            {/* Chronos section */}
                            <div className="card animate-fade-up delay-100">
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>Chronos-2 Lane Forecast</h3>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
                                    Enter historical transit times (minutes, comma-separated) for zero-shot lane delay forecast.
                                </p>
                                <textarea
                                    className="input"
                                    style={{ minHeight: 72, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }}
                                    value={chronosInput}
                                    onChange={(e) => setChronosInput(e.target.value)}
                                    placeholder="300, 320, 290, 310..."
                                />
                                <button
                                    type="button"
                                    disabled={chronosLoading}
                                    className="btn btn-accent btn-sm"
                                    style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                                    onClick={handleChronos}
                                >
                                    {chronosLoading ? "Forecasting…" : "Run Chronos-2 Forecast"}
                                </button>
                            </div>
                        </div>

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
                                    <Clock4 size={32} color="#d4d4d8" style={{ margin: "0 auto 16px" }} />
                                    Submit shipment details to predict ETA.
                                </div>
                            )}

                            {result && (
                                <>
                                    {/* Stat cards */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="animate-fade-up">
                                        {[
                                            { label: "Estimated ETA", value: formatMinutes(result.estimated_minutes), accent: true },
                                            { label: "SLA Breach Prob", value: `${(result.sla_breach_prob * 100).toFixed(1)}%` },
                                            { label: "Inference Time", value: `${result.inference_time_ms?.toFixed(1)}ms` },
                                        ].map((s) => (
                                            <div key={s.label} className="card">
                                                <div className="stat-label">{s.label}</div>
                                                <div className="stat-value" style={{ marginTop: 8, color: s.accent ? "var(--accent-text)" : "var(--text-primary)" }}>{s.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* SLA breach alert */}
                                    {slaBreached && (
                                        <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
                                            <AlertTriangle size={16} color="#dc2626" />
                                            <span style={{ fontSize: 14, color: "#b91c1c", fontWeight: 600 }}>
                                                High SLA breach probability ({(result.sla_breach_prob * 100).toFixed(1)}%) — consider intervention.
                                            </span>
                                        </div>
                                    )}

                                    {/* Confidence bands */}
                                    <div className="card animate-fade-up">
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 20px" }}>Confidence Intervals</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            {[
                                                { label: "p50 (Median)", value: result.p50, color: "#4ade80", max: result.p99 + 30 },
                                                { label: "p90 (90th pct)", value: result.p90, color: "#fb923c", max: result.p99 + 30 },
                                                { label: "p99 (99th pct)", value: result.p99, color: "#f87171", max: result.p99 + 30 },
                                            ].map(({ label, value, color, max }) => (
                                                <div key={label}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                                        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                                                            {formatMinutes(value)}
                                                        </span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                                            <div>
                                                <div className="stat-label">SLA Deadline</div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>{formatMinutes(form.sla_deadline_minutes ?? 0)}</div>
                                            </div>
                                            <div>
                                                <div className="stat-label">Weather</div>
                                                <div style={{ marginTop: 4 }}>
                                                    <Badge variant={result.weather_rain_flag ? "blue" : "green"}>
                                                        {result.weather_rain_flag ? "🌧 Rain" : "☀️ Clear"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="stat-label">Model</div>
                                                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 11 }}>
                                                    {result.prediction_source}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Analysis */}
                                    <InsightBox title="ZenETA — AI Delay Analysis" text={result.gemini_summary || "No summary generated."} />
                                </>
                            )}

                            {/* Chronos chart */}
                            {chronosResult && chartData.length > 0 && (
                                <div className="card animate-fade-up">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Chronos-2 Lane Delay Forecast</h3>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            Lane avg delay: <strong>{chronosResult.lane_avg_delay_30d?.toFixed(1)} min</strong>
                                        </span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                            <XAxis dataKey="step" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} unit="m" />
                                            <Tooltip
                                                formatter={(v) => [`${Number(v)} min`, "Forecast"]}
                                                contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                                            />
                                            <ReferenceLine y={form.sla_deadline_minutes} stroke="#f87171" strokeDasharray="4 4" label={{ value: "SLA", fill: "#f87171", fontSize: 10 }} />
                                            <Line type="monotone" dataKey="forecast" stroke="#fb923c" strokeWidth={2} dot={{ r: 3, fill: "#fb923c" }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
