import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    compact?: boolean;
}

export function GlassCard({ children, className = "", compact = false }: GlassCardProps) {
    return (
        <div className={`${compact ? "glass-card-sm" : "glass-card"} ${className}`}>
            {children}
        </div>
    );
}
