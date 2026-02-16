import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    delta?: string;
    deltaType?: "positive" | "negative" | "neutral";
}

export function KpiCard({ label, value, icon: Icon, delta, deltaType = "neutral" }: KpiCardProps) {
    return (
        <div className="glass-card-sm">
            <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-text-tertiary" />
                <span className="text-[0.75rem] text-text-tertiary uppercase tracking-wider font-medium">
                    {label}
                </span>
            </div>
            <div className="text-[1.75rem] font-bold text-text-primary tracking-tight leading-tight">
                {value}
            </div>
            {delta && (
                <div className={`mt-2 badge-${deltaType}`}>
                    {deltaType === "positive" && "↑ "}
                    {deltaType === "negative" && "↓ "}
                    {delta}
                </div>
            )}
        </div>
    );
}
