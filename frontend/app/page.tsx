import Link from "next/link";
import { BrainCircuit, PackageSearch, Clock4, ArrowRight, Zap, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Zen Platform — Intelligent Logistics, Simplified",
  description: "ZenDec, ZenRTO, and ZenETA unified into one AI logistics platform powered by fine-tuned LLMs.",
};

const modules = [
  {
    id: "zendec",
    name: "ZenDec",
    tag: "Decision Engine",
    desc: "Multi-objective carrier selection using TOPSIS scoring, AQI enrichment, and Human-in-the-Loop approval flows.",
    href: "/demand",
    icon: BrainCircuit,
    color: "#4ade80",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    delay: "0ms",
  },
  {
    id: "zenrto",
    name: "ZenRTO",
    tag: "RTO Risk Scoring",
    desc: "LightGBM-powered return-to-origin fraud detection with SHAP explainability and WhatsApp confirmation flows.",
    href: "/routes",
    icon: PackageSearch,
    color: "#60a5fa",
    bg: "#eff6ff",
    border: "#bfdbfe",
    delay: "100ms",
  },
  {
    id: "zeneta",
    name: "ZenETA",
    tag: "ETA Prediction",
    desc: "XGBoost + Chronos-2 time-series ETA prediction with p50/p90/p99 confidence bands and live weather enrichment.",
    href: "/eta",
    icon: Clock4,
    color: "#fb923c",
    bg: "#fff7ed",
    border: "#fed7aa",
    delay: "200ms",
  },
];

const steps = [
  { n: "01", title: "Input Data", desc: "Submit shipment, order, or carrier data via the module form or REST API." },
  { n: "02", title: "AI Processing", desc: "ML models run inference while our fine-tuned Llama 3B generates contextual insights." },
  { n: "03", title: "Actionable Output", desc: "Get ranked decisions, risk scores, or ETAs with confidence intervals — saved to Supabase." },
];

const tech = ["XGBoost", "Chronos‑2", "LightGBM", "Llama 3B", "Supabase", "FastAPI", "Next.js"];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250, 250, 250, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #4ade80, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Zen Platform
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
          <Link href="/demand" className="btn btn-ghost btn-sm">ZenDec</Link>
          <Link href="/routes" className="btn btn-ghost btn-sm">ZenRTO</Link>
          <Link href="/eta" className="btn btn-ghost btn-sm">ZenETA</Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm">Open App →</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "92vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid background */}
        <div className="grid-bg" style={{
          position: "absolute", inset: 0, opacity: 0.6,
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
        }} />

        {/* Green glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(74, 222, 128, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          {/* Pill badge */}
          <div className="animate-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--accent-soft)", border: "1px solid #bbf7d0",
            borderRadius: 99, padding: "5px 14px", marginBottom: 32,
            fontSize: 12, fontWeight: 600, color: "var(--accent-text)",
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Powered by Llama 3B · XGBoost · Chronos-2
          </div>

          <h1 className="animate-fade-up delay-100" style={{
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800, letterSpacing: "-0.04em",
            lineHeight: 1.08, color: "var(--text-primary)",
            margin: "0 0 24px",
          }}>
            Intelligent Logistics,<br />
            <span className="gradient-text-green">Simplified.</span>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            fontSize: 18, color: "var(--text-secondary)",
            lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px",
          }}>
            Three unified AI modules — carrier decision intelligence, RTO fraud prevention,
            and precise ETA prediction — all in one platform.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              View Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="#modules" className="btn btn-secondary btn-lg">
              Explore Modules
            </Link>
          </div>

          {/* Module badges */}
          <div className="animate-fade-up delay-400" style={{
            display: "flex", gap: 16, justifyContent: "center", marginTop: 64, flexWrap: "wrap",
          }}>
            {modules.map((m) => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: m.bg, border: `1px solid ${m.border}`,
                borderRadius: 10, padding: "8px 16px",
              }}>
                <m.icon size={15} color={m.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{m.name}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ──────────────────────────────────────────────── */}
      <section id="modules" style={{ padding: "96px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="badge badge-green" style={{ marginBottom: 16 }}>Three Modules</div>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", color: "var(--text-primary)" }}>
            One Unified Platform
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Each module tackles a distinct logistics challenge, powered by state-of-the-art ML.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {modules.map((m, i) => (
            <Link
              key={m.id}
              href={m.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card card-hover animate-fade-up"
                style={{ animationDelay: m.delay, height: "100%", cursor: "pointer" }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: m.bg, border: `1px solid ${m.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <m.icon size={22} color={m.color} />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{m.name}</span>
                  <span className="badge badge-zinc" style={{ marginLeft: 8 }}>{m.tag}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 20px" }}>
                  {m.desc}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: m.color, fontWeight: 600 }}>
                  Open Module <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            How It Works
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 64 }}>
            From raw data to actionable logistics decisions in seconds.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: 40, left: "16.7%", right: "16.7%", height: 1, background: "var(--border)", zIndex: 0 }} />
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 99,
                  background: i === 1 ? "var(--text-primary)" : "#fff",
                  border: `2px solid ${i === 1 ? "var(--text-primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24, position: "relative", zIndex: 1,
                  boxShadow: i === 1 ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: i === 1 ? "#fff" : "var(--text-muted)",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {step.n}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 10px", color: "var(--text-primary)" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────── */}
      <section style={{ padding: "64px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 32 }}>
            Built with enterprise-grade ML & AI
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {tech.map((t) => (
              <div key={t} style={{
                padding: "8px 18px",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────── */}
      <section style={{
        background: "var(--text-primary)",
        padding: "96px 40px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: 20 }}>
            Ready to ship
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 20px" }}>
            Built for the future<br />of logistics.
          </h2>
          <p style={{ fontSize: 16, color: "#a1a1aa", lineHeight: 1.7, marginBottom: 40 }}>
            Real-time decisions. Zero compromises. Powered by the same ML techniques used at leading logistics companies.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{
              padding: "12px 28px",
              background: "#4ade80",
              color: "#14532d",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "background 150ms ease",
            }}>
              Enter Dashboard <ArrowRight size={16} />
            </Link>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" style={{
              padding: "12px 28px",
              background: "transparent",
              color: "#a1a1aa",
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 15,
              textDecoration: "none",
              border: "1px solid #3f3f46",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}>
              API Documentation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
