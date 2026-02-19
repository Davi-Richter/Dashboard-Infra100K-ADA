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
    tooltipFormatValue?: (v: number) => string;
    yAxisWidth?: number;
}

export function HorizontalBarGlass({
    data,
    nameKey,
    valueKey,
    height = 350,
    color = "#22c55e",
    formatValue,
    tooltipFormatValue,
    yAxisWidth = 80,
}: HorizontalBarGlassProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
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
                    width={yAxisWidth}
                />
                <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <GlassTooltip
                                    label={String(label)}
                                    payload={[{
                                        name: "Valor",
                                        value: payload[0].value as number,
                                        color: payload[0].color
                                    }]}
                                    formatValue={tooltipFormatValue || formatValue}
                                />
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
}
