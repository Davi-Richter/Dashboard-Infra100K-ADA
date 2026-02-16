"use client";

import { useState, useCallback, useMemo } from "react";
import type { FilterState, Venda, FacebookRow, GeralRow } from "@/types/dashboard";
import { format } from "date-fns";
import { DATA_START_DATE } from "@/lib/constants";

const DEFAULT_FILTERS: FilterState = {
    dateRange: { from: "", to: "" },
    produtos: [],
    campanhas: [],
    objetivos: [],
};

export function useFilters() {
    const [filters, setFilters] = useState<FilterState>(() => ({
        ...DEFAULT_FILTERS,
        dateRange: {
            from: DATA_START_DATE,
            to: format(new Date(), "yyyy-MM-dd"),
        },
    }));

    const setDateRange = useCallback((from: string, to: string) => {
        setFilters((prev) => ({ ...prev, dateRange: { from, to } }));
    }, []);

    const setProdutos = useCallback((produtos: string[]) => {
        setFilters((prev) => ({ ...prev, produtos }));
    }, []);

    const setCampanhas = useCallback((campanhas: string[]) => {
        setFilters((prev) => ({ ...prev, campanhas }));
    }, []);

    const setObjetivos = useCallback((objetivos: string[]) => {
        setFilters((prev) => ({ ...prev, objetivos }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return { filters, setDateRange, setProdutos, setCampanhas, setObjetivos, resetFilters };
}

// ─── Filter application ──────────────────────────────────────────

export function filterVendas(vendas: Venda[], filters: FilterState): Venda[] {
    let result = vendas;

    if (filters.dateRange.from) {
        result = result.filter((v) => v.data >= filters.dateRange.from);
    }
    if (filters.dateRange.to) {
        result = result.filter((v) => v.data <= filters.dateRange.to);
    }
    if (filters.produtos.length > 0) {
        result = result.filter((v) => filters.produtos.includes(v.produto));
    }

    return result;
}

export function filterFacebook(facebook: FacebookRow[], filters: FilterState): FacebookRow[] {
    let result = facebook;

    if (filters.dateRange.from) {
        result = result.filter((r) => r.data >= filters.dateRange.from);
    }
    if (filters.dateRange.to) {
        result = result.filter((r) => r.data <= filters.dateRange.to);
    }
    if (filters.campanhas.length > 0) {
        result = result.filter((r) => filters.campanhas.includes(r.campaignName));
    }
    if (filters.objetivos.length > 0) {
        result = result.filter((r) => filters.objetivos.includes(r.objective));
    }

    return result;
}

export function filterGeral(geral: GeralRow[], filters: FilterState): GeralRow[] {
    let result = geral;

    if (filters.dateRange.from) {
        result = result.filter((r) => r.data >= filters.dateRange.from);
    }
    if (filters.dateRange.to) {
        result = result.filter((r) => r.data <= filters.dateRange.to);
    }

    return result;
}
