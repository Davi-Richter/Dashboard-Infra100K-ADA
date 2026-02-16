import { GlassCard } from "./glass-card";

interface Column<T> {
    key: string;
    label: string;
    format?: (value: unknown, row: T) => string;
    align?: "left" | "right" | "center";
}

interface DataTableProps<T extends Record<string, unknown>> {
    data: T[];
    columns: Column<T>[];
    maxHeight?: number;
    highlightKey?: string;
    highlightValue?: unknown;
}

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    maxHeight = 400,
    highlightKey,
    highlightValue,
}: DataTableProps<T>) {
    return (
        <GlassCard className="!p-0 overflow-hidden">
            <div className="overflow-auto" style={{ maxHeight }}>
                <table className="table-glass">
                    <thead className="sticky top-0 z-10" style={{ background: "rgba(9, 9, 27, 0.95)" }}>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className={col.align === "right" ? "!text-right" : ""}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => {
                            const isHighlighted = highlightKey && row[highlightKey] === highlightValue;
                            return (
                                <tr
                                    key={i}
                                    className={isHighlighted ? "!border-l-2 !border-l-accent" : ""}
                                >
                                    {columns.map((col) => {
                                        const val = row[col.key];
                                        const display = col.format ? col.format(val, row) : String(val ?? "");
                                        return (
                                            <td key={col.key} className={col.align === "right" ? "!text-right" : ""}>
                                                {display}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="!text-center !text-text-tertiary !py-8">
                                    Sem dados disponíveis
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
