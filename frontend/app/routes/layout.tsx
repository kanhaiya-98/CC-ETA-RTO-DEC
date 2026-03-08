import Sidebar from "@/components/layout/Sidebar";
export default function RoutesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</div>
        </div>
    );
}
