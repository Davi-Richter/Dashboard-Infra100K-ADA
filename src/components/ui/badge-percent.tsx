interface BadgePercentProps {
    value: number;
    suffix?: string;
}

export function BadgePercent({ value, suffix = "%" }: BadgePercentProps) {
    const type = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
    const arrow = value > 0 ? "↑" : value < 0 ? "↓" : "";

    return (
        <span className={`badge-${type}`}>
            {arrow} {Math.abs(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}{suffix}
        </span>
    );
}
