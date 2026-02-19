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
        <div className="glass-card-sm group">
            <div className="flex items-center gap-3 mb-3">
                {/* Ícone com fundo glass — estilo Quantix */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center
                        bg-accent-muted border border-accent/10
                        group-hover:bg-accent/15 transition-colors duration-300">
                    <Icon size={15} className="text-accent" />
                </div>
                <span className="text-[0.7rem] text-text-tertiary uppercase tracking-[0.06em] font-semibold">
                    {label}
                </span>
            </div>
            <div className="text-xl md:text-[1.85rem] font-bold text-white tracking-tight leading-none truncate" title={value}>
                {value}
            </div>
            {delta && (
                <div className={`mt-3 badge-${deltaType}`}>
                    {deltaType === "positive" && "↑ "}
                    {deltaType === "negative" && "↓ "}
                    {delta}
                </div>
            )}
        </div>
    );
}
