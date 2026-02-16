// ─── Format Currency ─────────────────────────────────────────────

export function formatCurrency(value: number): string {
    if (!isFinite(value)) return "R$ 0,00";
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// ─── Format Number ───────────────────────────────────────────────

export function formatNumber(value: number): string {
    if (!isFinite(value)) return "0";
    return Math.round(value).toLocaleString("pt-BR");
}

// ─── Format Percent ──────────────────────────────────────────────

export function formatPercent(value: number): string {
    if (!isFinite(value)) return "0,00%";
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + "%";
}

// ─── Parse Currency (BR format) ──────────────────────────────────

export function parseCurrency(raw: string | number | null | undefined): number {
    if (raw === null || raw === undefined || raw === "") return 0;
    if (typeof raw === "number") return isNaN(raw) ? 0 : raw;

    const str = String(raw).trim();
    if (str === "" || str === "-") return 0;

    // Detect negative: can be "-R$ 330,38" or "(R$ 330,38)" etc.
    const isNegative = str.startsWith("-") || str.includes("(");

    // Remove "R$", spaces, parentheses
    let cleaned = str.replace(/R\$/g, "").replace(/[() ]/g, "").replace(/-/g, "");

    // Brazilian format: 1.234.567,89
    // Remove dots (thousands separator), replace comma with dot (decimal)
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");

    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;

    return isNegative ? -num : num;
}

// ─── Format compact ─────────────────────────────────────────────

export function formatCompact(value: number): string {
    if (!isFinite(value)) return "0";
    if (Math.abs(value) >= 1_000_000) {
        return (value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "M";
    }
    if (Math.abs(value) >= 1_000) {
        return (value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "K";
    }
    return Math.round(value).toLocaleString("pt-BR");
}
