"use client";

import { Tooltip } from "recharts";
import { formatCompact } from "@/lib/formatters";
import { useState } from "react";

interface FunnelStage {
    name: string;
    value: number;
}

interface FunnelChartGlassProps {
    stages: FunnelStage[];
    height?: number;
}

export function FunnelChartGlass({ stages, height = 400 }: FunnelChartGlassProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (stages.length === 0) return null;

    const maxVal = stages[0].value || 1;

    return (
        <div className="flex flex-col items-center justify-center space-y-2 relative" style={{ minHeight: height }}>
            {stages.map((stage, i) => {
                const width = Math.max((stage.value / maxVal) * 100, 10);
                const pctOfPrev = i === 0 ? 100 : stages[i - 1].value > 0
                    ? (stage.value / stages[i - 1].value) * 100
                    : 0;
                const opacity = 0.8 - i * 0.12;

                return (
                    <div
                        key={stage.name}
                        className="w-full flex flex-col items-center group relative cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* The Funnel Bar */}
                        <div
                            className="h-12 flex items-center justify-center transition-all duration-500 rounded-sm relative"
                            style={{
                                width: `${width}%`,
                                background: `rgba(255, 255, 255, ${opacity})`,
                                clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0% 100%)" // Slightly trapezoidal
                            }}
                        >
                            <span className="text-sm font-semibold text-[#09091b] whitespace-nowrap z-10 hidden md:block">
                                {formatCompact(stage.value)}
                            </span>
                        </div>

                        {/* Name and metrics below or beside */}
                        <div className="text-xs text-text-secondary mt-1 tracking-wider text-center flex flex-col items-center gap-1">
                            <span className="font-medium">{stage.name}</span>
                            <span className="text-[0.65rem] text-text-tertiary">
                                {i === 0 ? "100%" : `${pctOfPrev.toFixed(1)}%`} conversão
                            </span>
                        </div>

                        {/* Custom Tooltip */}
                        {hoveredIndex === i && (
                            <div className="absolute top-[-30px] z-50 bg-[#09091b]/90 border border-white/10 px-3 py-1.5 rounded-md text-sm shadow-xl backdrop-blur-md pointer-events-none">
                                <span className="font-medium text-white">{stage.name}: </span>
                                <span className="text-[#22c55e]">{stage.value.toLocaleString('pt-BR')}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

