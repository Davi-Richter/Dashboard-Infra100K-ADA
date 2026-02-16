"use client";

interface GaugeChartGlassProps {
    value: number;
    max: number;
    reference?: number;
    suffix?: string;
    title?: string;
    height?: number;
}

export function GaugeChartGlass({
    value,
    max,
    reference = 3,
    suffix = "x",
    height = 300,
}: GaugeChartGlassProps) {
    const clamped = Math.min(Math.max(value, 0), max);

    // Geometry
    const size = 300;
    const cx = size / 2;
    const cy = 160;
    const radius = 110;
    const strokeWidth = 22;
    const valueStrokeWidth = 8;

    // Semicircle = half circumference
    const halfCircumference = Math.PI * radius;

    // Helper: convert a 0..max value to a dash length
    const valueToDash = (v: number) => (v / max) * halfCircumference;

    // Zone boundaries
    const zone1Val = Math.min(reference * 0.5, max);
    const zone2Val = Math.min(reference, max);

    // Value indicator dot position
    const valueAngle = Math.PI - (clamped / max) * Math.PI;
    const dotX = cx + radius * Math.cos(valueAngle);
    const dotY = cy - radius * Math.sin(valueAngle);

    // Reference tick position
    const refAngle = Math.PI - (reference / max) * Math.PI;
    const tickLen = strokeWidth / 2 + 6;
    const refTickX1 = cx + (radius - tickLen) * Math.cos(refAngle);
    const refTickY1 = cy - (radius - tickLen) * Math.sin(refAngle);
    const refTickX2 = cx + (radius + tickLen) * Math.cos(refAngle);
    const refTickY2 = cy - (radius + tickLen) * Math.sin(refAngle);

    // Delta
    const delta = value - reference;
    const deltaStr = delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);
    const deltaColor = delta >= 0 ? "#22c55e" : "#ef4444";

    // Semicircle path: starts at left, arcs over the top to the right
    const arcD = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

    return (
        <div className="flex flex-col items-center justify-center" style={{ height }}>
            <svg
                viewBox={`0 0 ${size} 200`}
                width="100%"
                style={{ maxWidth: 340, overflow: "visible" }}
            >
                <defs>
                    <filter id="gauge-dot-glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background track */}
                <path
                    d={arcD}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={strokeWidth}
                />

                {/* Green zone (full semicircle — bottom layer) */}
                <path
                    d={arcD}
                    fill="none"
                    stroke="rgba(34,197,94,0.20)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={halfCircumference}
                    strokeDashoffset={0}
                />

                {/* Yellow zone: 0 → zone2 (middle layer, covers green) */}
                <path
                    d={arcD}
                    fill="none"
                    stroke="rgba(245,158,11,0.20)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${valueToDash(zone2Val)} ${halfCircumference}`}
                    strokeDashoffset={0}
                />

                {/* Red zone: 0 → zone1 (top layer, covers yellow) */}
                <path
                    d={arcD}
                    fill="none"
                    stroke="rgba(239,68,68,0.20)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${valueToDash(zone1Val)} ${halfCircumference}`}
                    strokeDashoffset={0}
                />

                {/* Value arc (white, thinner) */}
                {clamped > 0 && (
                    <path
                        d={arcD}
                        fill="none"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth={valueStrokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${valueToDash(clamped)} ${halfCircumference}`}
                        strokeDashoffset={0}
                    />
                )}

                {/* Reference tick */}
                <line
                    x1={refTickX1}
                    y1={refTickY1}
                    x2={refTickX2}
                    y2={refTickY2}
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    opacity={0.8}
                />

                {/* Value dot with glow */}
                <circle
                    cx={dotX}
                    cy={dotY}
                    r={6}
                    fill="white"
                    filter="url(#gauge-dot-glow)"
                />

                {/* Value text */}
                <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="38"
                    fontWeight="700"
                    fontFamily="Inter, system-ui, sans-serif"
                >
                    {value.toFixed(2)}
                </text>
                <text
                    x={cx}
                    y={cy + 14}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.30)"
                    fontSize="14"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight="500"
                >
                    {suffix}
                </text>
            </svg>

            {/* Delta */}
            <p
                className="text-sm font-semibold -mt-1"
                style={{ color: deltaColor }}
            >
                {deltaStr} vs meta ({reference}{suffix})
            </p>
        </div>
    );
}
