"use client";

interface GlassTooltipProps {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; color?: string }>;
    label?: string;
    formatValue?: (v: number) => string;
}

export function GlassTooltip({ active, payload, label, formatValue }: GlassTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip">
            <p className="text-text-secondary text-xs mb-1.5">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} className="text-text-primary text-sm font-medium">
                    <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}: {formatValue ? formatValue(Number(entry.value)) : String(entry.value)}
                </p>
            ))}
        </div>
    );
}
