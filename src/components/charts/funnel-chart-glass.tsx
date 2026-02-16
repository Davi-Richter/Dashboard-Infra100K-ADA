"use client";

import { formatCompact } from "@/lib/formatters";

interface FunnelStage {
    name: string;
    value: number;
}

interface FunnelChartGlassProps {
    stages: FunnelStage[];
    height?: number;
}

export function FunnelChartGlass({ stages, height = 400 }: FunnelChartGlassProps) {
    if (stages.length === 0) return null;

    const maxVal = stages[0].value || 1;

    return (
        <div className="space-y-3" style={{ minHeight: height }}>
            {stages.map((stage, i) => {
                const width = Math.max((stage.value / maxVal) * 100, 8);
                const pctOfPrev = i === 0 ? 100 : stages[i - 1].value > 0
                    ? (stage.value / stages[i - 1].value) * 100
                    : 0;
                const opacity = 0.7 - i * 0.12;

                return (
                    <div key={stage.name} className="flex items-center gap-4">
                        <div className="w-28 text-right text-sm text-text-secondary shrink-0 truncate">
                            {stage.name}
                        </div>
                        <div className="flex-1 relative">
                            <div
                                className="h-10 rounded-md flex items-center px-4 transition-all duration-500"
                                style={{
                                    width: `${width}%`,
                                    background: `rgba(255, 255, 255, ${opacity})`,
                                }}
                            >
                                <span className="text-sm font-semibold text-[#09091b] whitespace-nowrap">
                                    {formatCompact(stage.value)}
                                </span>
                            </div>
                        </div>
                        <div className="w-16 text-xs text-text-tertiary shrink-0">
                            {i === 0 ? "100%" : `${pctOfPrev.toFixed(1)}%`}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
