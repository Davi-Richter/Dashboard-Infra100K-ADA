"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";
import { GlassTooltip } from "./glass-tooltip";

interface BarChartGlassProps {
    data: Record<string, unknown>[];
    xKey: string;
    yKey: string;
    height?: number;
    color?: string;
    formatValue?: (v: number) => string;
}

export function BarChartGlass({
    data,
    xKey,
    yKey,
    height = 350,
    color = "rgba(255,255,255,0.6)",
    formatValue,
}: BarChartGlassProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
                <Bar dataKey={yKey} radius={[4, 4, 0, 0]} fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
}
