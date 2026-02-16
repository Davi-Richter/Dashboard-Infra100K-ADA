"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { GlassTooltip } from "./glass-tooltip";

interface HorizontalBarGlassProps {
    data: Record<string, unknown>[];
    nameKey: string;
    valueKey: string;
    height?: number;
    color?: string;
    formatValue?: (v: number) => string;
}

export function HorizontalBarGlass({
    data,
    nameKey,
    valueKey,
    height = 350,
    color = "#22c55e",
    formatValue,
}: HorizontalBarGlassProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <XAxis
                    type="number"
                    tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatValue}
                />
                <YAxis
                    type="category"
                    dataKey={nameKey}
                    tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                />
                <Tooltip content={<GlassTooltip formatValue={formatValue} />} />
                <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
}
