"use client";

import { formatCompact } from "@/lib/formatters";

interface WaterfallItem {
    name: string;
    value: number;
    type: "absolute" | "relative" | "total";
}

interface WaterfallChartGlassProps {
    items: WaterfallItem[];
    height?: number;
}

export function WaterfallChartGlass({ items, height = 350 }: WaterfallChartGlassProps) {
    if (items.length === 0) return null;

    const maxAbs = Math.max(...items.map((i) => Math.abs(i.value || 0))) || 1;

    let cumulative = 0;
    const processed = items.map((item) => {
        const val = isFinite(item.value) ? item.value : 0;
        if (item.type === "absolute") {
            cumulative = val;
            return { ...item, value: val, start: 0, barValue: val };
        } else if (item.type === "relative") {
            const start = cumulative;
            cumulative += val;
            return { ...item, value: val, start, barValue: val };
        } else {
            return { ...item, value: val, start: 0, barValue: val };
        }
    });

    return (
        <div className="flex items-end gap-3 justify-center" style={{ height }}>
            {processed.map((item, i) => {
                const barHeight = Math.max((Math.abs(item.barValue) / maxAbs) * (height - 60), 20) || 20;
                const isNeg = item.value < 0;
                const isTotal = item.type === "total";

                let bgColor = "rgba(255,255,255,0.7)";
                if (isNeg) bgColor = "rgba(239, 68, 68, 0.7)";
                if (isTotal) bgColor = "rgba(59, 130, 246, 0.7)";

                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-xs text-text-secondary font-medium">
                            {formatCompact(item.value)}
                        </span>
                        <div
                            className="w-full rounded-t-md transition-all duration-500"
                            style={{
                                height: barHeight,
                                background: bgColor,
                                maxWidth: 80,
                            }}
                        />
                        <span className="text-xs text-text-tertiary text-center leading-tight">
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
