"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { GlassTooltip } from "./glass-tooltip";

interface AreaChartGlassProps {
    data: Record<string, unknown>[];
    xKey: string;
    yKeys: string[];
    labels?: string[];
    height?: number;
    formatValue?: (v: number) => string;
}

export function AreaChartGlass({
    data,
    xKey,
    yKeys,
    labels,
    height = 350,
    formatValue,
}: AreaChartGlassProps) {
    const names = labels || yKeys;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    {/* SVG glow filter for active dots */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {yKeys.map((key, i) => (
                        <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.25} />
                            <stop offset="50%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.08} />
                            <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid
                    strokeDasharray="0"
                    stroke="rgba(255,255,255,0.03)"
                    vertical={false}
                />
                <XAxis
                    dataKey={xKey}
                    tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatValue}
                />
                <Tooltip content={<GlassTooltip formatValue={formatValue} />} />
                {yKeys.map((key, i) => (
                    <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={names[i]}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2}
                        fill={`url(#grad-${key})`}
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: CHART_COLORS[i % CHART_COLORS.length],
                            stroke: CHART_COLORS[i % CHART_COLORS.length],
                            strokeWidth: 2,
                            strokeOpacity: 0.3,
                            filter: "url(#glow)",
                        }}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}
