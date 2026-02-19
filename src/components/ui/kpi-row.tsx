import { ReactNode } from "react";

interface KpiRowProps {
    children: ReactNode;
    cols?: number;
}

export function KpiRow({ children, cols }: KpiRowProps) {
    let colClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // default

    if (cols === 1) colClass = "grid-cols-1";
    else if (cols === 2) colClass = "grid-cols-1 sm:grid-cols-2";
    else if (cols === 3) colClass = "grid-cols-1 sm:grid-cols-3";
    else if (cols === 4) colClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    else if (cols === 5) colClass = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

    return (
        <div className={`grid ${colClass} gap-4`}>
            {children}
        </div>
    );
}
