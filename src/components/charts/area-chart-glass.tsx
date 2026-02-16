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
                    {yKeys.map((key, i) => (
                        <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                />
                <XAxis
                    dataKey={xKey}
                    tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
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
                        strokeWidth={2.5}
                        fill={`url(#grad-${key})`}
                        dot={{ r: 3, fill: CHART_COLORS[i % CHART_COLORS.length], strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: CHART_COLORS[i % CHART_COLORS.length], stroke: "rgba(0,0,0,0.5)", strokeWidth: 2 }}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}
