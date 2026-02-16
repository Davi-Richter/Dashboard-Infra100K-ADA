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
    title = "",
    height = 280,
}: GaugeChartGlassProps) {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const angle = (clampedValue / max) * 180;
    const refAngle = (reference / max) * 180;

    const r = 100;
    const cx = 120;
    const cy = 130;

    const polarToCart = (angleDeg: number) => {
        const rad = ((180 - angleDeg) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    };

    // Zone arcs
    const makeArc = (startAngle: number, endAngle: number) => {
        const s = polarToCart(startAngle);
        const e = polarToCart(endAngle);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
    };

    const zone1End = Math.min((reference * 0.5 / max) * 180, 180);
    const zone2End = Math.min((reference / max) * 180, 180);

    // Needle
    const needleEnd = polarToCart(angle);

    // Delta
    const delta = value - reference;
    const deltaStr = delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);
    const deltaColor = delta >= 0 ? "#22c55e" : "#ef4444";

    return (
        <div className="flex flex-col items-center" style={{ height }}>
            <svg viewBox="0 0 240 160" width="100%" style={{ maxWidth: 280 }}>
                {/* Background arc */}
                <path
                    d={makeArc(0, 180)}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />
                {/* Red zone */}
                <path
                    d={makeArc(0, zone1End)}
                    fill="none"
                    stroke="rgba(239,68,68,0.2)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />
                {/* Yellow zone */}
                <path
                    d={makeArc(zone1End, zone2End)}
                    fill="none"
                    stroke="rgba(245,158,11,0.2)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />
                {/* Green zone */}
                <path
                    d={makeArc(zone2End, 180)}
                    fill="none"
                    stroke="rgba(34,197,94,0.2)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                    d={makeArc(0, angle)}
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                {/* Reference line */}
                {(() => {
                    const rp = polarToCart(refAngle);
                    const rp2 = polarToCart(refAngle);
                    const innerR = r - 14;
                    const outerR = r + 14;
                    const rad = ((180 - refAngle) * Math.PI) / 180;
                    const x1 = cx + innerR * Math.cos(rad);
                    const y1 = cy - innerR * Math.sin(rad);
                    const x2 = cx + outerR * Math.cos(rad);
                    const y2 = cy - outerR * Math.sin(rad);
                    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="2" />;
                })()}
                {/* Needle dot */}
                <circle cx={needleEnd.x} cy={needleEnd.y} r="5" fill="white" />
                {/* Center value */}
                <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="Inter">
                    {value.toFixed(2)}
                </text>
                <text x={cx} y={cy + 15} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="Inter">
                    {suffix}
                </text>
            </svg>
            {title && <p className="text-text-secondary text-sm mt-1">{title}</p>}
            <p className="text-sm font-medium mt-1" style={{ color: deltaColor }}>
                {deltaStr} vs meta ({reference}{suffix})
            </p>
        </div>
    );
}
