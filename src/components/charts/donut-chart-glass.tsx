"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { GlassTooltip } from "./glass-tooltip";

interface DonutChartGlassProps {
    data: { name: string; value: number }[];
    height?: number;
}

export function DonutChartGlass({ data, height = 350 }: DonutChartGlassProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="#09091b"
                    strokeWidth={2}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
}
