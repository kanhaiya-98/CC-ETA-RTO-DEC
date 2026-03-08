"use client";

import Link from "next/link";
import { Bell, User, ExternalLink } from "lucide-react";

interface NavbarProps {
    title?: string;
    breadcrumb?: string;
}

export default function Navbar({ title, breadcrumb }: NavbarProps) {
    return (
        <header
            style={{
                height: 56,
                background: "#fff",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            {/* Left: breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                {breadcrumb && (
                    <>
                        <span>{breadcrumb}</span>
                        <span style={{ color: "var(--border)" }}>/</span>
                    </>
                )}
                {title && (
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{title}</span>
                )}
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a
                    href="http://localhost:8000/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12, color: "var(--text-muted)" }}
                >
                    <ExternalLink size={13} />
                    API Docs
                </a>
                <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: 6, borderRadius: 8 }}
                    aria-label="Notifications"
                >
                    <Bell size={16} color="var(--text-secondary)" />
                </button>
                <button
                    aria-label="User menu"
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 99,
                        background: "var(--accent-soft)",
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <User size={15} color="var(--accent-text)" />
                </button>
            </div>
        </header>
    );
}
