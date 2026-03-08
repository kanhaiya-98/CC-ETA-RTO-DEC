const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "API request failed");
    }
    return res.json();
}

// ── Health ────────────────────────────────────────────────────────
export const fetchHealth = () => fetchApi<{ status: string; platform: string; xgboost_loaded: boolean; chronos_loaded: boolean }>("/api/health");

// ── ZenDec ────────────────────────────────────────────────────────
export interface CarrierInput {
    carrier_id: string;
    carrier_name: string;
    route: string;
    vehicle_type: string;
    cost_inr: number;
    cost_delta?: number;
    eta_hours: number;
    eta_delta?: number;
    distance_km: number;
    weight_tonnes: number;
    sla_breach_prob?: number;
    historical_breach_rate?: number;
}

export interface DecisionRequest {
    blast_radius: number;
    confidence: number;
    city?: string;
    carriers: CarrierInput[];
    historical_summary?: string;
    known_pattern?: boolean;
}

export const runDecision = (req: DecisionRequest) =>
    fetchApi<any>("/api/demand/run", { method: "POST", body: JSON.stringify(req) });

export const fetchPolicy = () => fetchApi<{ current_policy: string; aqi_override: any }>("/api/demand/policy");

export const updatePolicy = (policy: string) =>
    fetchApi<any>("/api/demand/policy", { method: "POST", body: JSON.stringify({ policy }) });

export const fetchPendingCards = () => fetchApi<{ pending: any[]; count: number }>("/api/demand/pending");

export const fetchRecentDecisions = () => fetchApi<{ decisions: any[] }>("/api/demand/log/recent");

// ── ZenRTO ────────────────────────────────────────────────────────
export interface OrderScoreRequest {
    order_id: string;
    buyer_id: string;
    pincode: string;
    address_raw: string;
    payment_method: string;
    order_value: number;
    product_category?: string;
    device_type?: string;
    buyer_phone?: string;
    hour_of_day?: number;
    day_of_week?: number;
}

export const scoreOrder = (req: OrderScoreRequest) =>
    fetchApi<any>("/api/routes/score", { method: "POST", body: JSON.stringify(req) });

export const fetchRouteStats = () => fetchApi<any>("/api/routes/stats");

export const fetchOrders = (risk_level?: string) =>
    fetchApi<any[]>(`/api/routes/orders${risk_level ? `?risk_level=${risk_level}` : ""}`);

// ── ZenETA ────────────────────────────────────────────────────────
export interface ETARequest {
    shipment_id: string;
    route_distance_km: number;
    carrier_id?: string;
    region?: string;
    hour?: number;
    dow?: number;
    warehouse_throughput_15min?: number;
    aqi_speed_multiplier?: number;
    lane_avg_delay_30d?: number;
    sla_deadline_minutes?: number;
    origin_lat?: number;
    origin_lon?: number;
    dest_lat?: number;
    dest_lon?: number;
}

export const predictETA = (req: ETARequest) =>
    fetchApi<any>("/api/eta/predict", { method: "POST", body: JSON.stringify(req) });

export const predictChronos = (req: { shipment_id: string; historical_transit_times: number[]; baseline_minutes?: number }) =>
    fetchApi<any>("/api/eta/predict/chronos", { method: "POST", body: JSON.stringify(req) });
