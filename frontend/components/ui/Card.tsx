import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    style?: React.CSSProperties;
}

export default function Card({ children, hover, style }: CardProps) {
    return (
        <div className={`card${hover ? " card-hover" : ""}`} style={style}>
            {children}
        </div>
    );
}
