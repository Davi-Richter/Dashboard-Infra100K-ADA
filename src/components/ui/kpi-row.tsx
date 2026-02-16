import { ReactNode } from "react";

interface KpiRowProps {
    children: ReactNode;
    cols?: number;
}

export function KpiRow({ children, cols }: KpiRowProps) {
    const gridClass = cols
        ? `grid-cols-${cols}`
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

    return (
        <div className={`grid ${gridClass} gap-4`} style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}>
            {children}
        </div>
    );
}
