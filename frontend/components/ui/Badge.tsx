interface BadgeProps {
    children: React.ReactNode;
    variant?: "green" | "red" | "amber" | "blue" | "purple" | "zinc";
    dot?: boolean;
}

export default function Badge({ children, variant = "zinc", dot }: BadgeProps) {
    return (
        <span className={`badge badge-${variant}`}>
            {dot && (
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "currentColor",
                        display: "inline-block",
                    }}
                />
            )}
            {children}
        </span>
    );
}
