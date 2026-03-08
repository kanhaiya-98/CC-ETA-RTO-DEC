import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

export function riskColor(risk: string): string {
    const map: Record<string, string> = {
        LOW: "badge-green",
        MEDIUM: "badge-amber",
        HIGH: "badge-red",
        CRITICAL: "badge-red",
        AUTO_APPROVE: "badge-green",
        PARETO_CARD: "badge-amber",
        FULL_ESCALATE: "badge-red",
    };
    return map[risk?.toUpperCase()] || "badge-zinc";
}

export function truncate(str: string, n: number): string {
    return str.length > n ? str.slice(0, n) + "…" : str;
}
