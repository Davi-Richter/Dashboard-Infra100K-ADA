"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardData } from "@/types/dashboard";

const EMPTY_DATA: DashboardData = { vendas: [], facebook: [], geral: [] };

export function useDashboardData() {
    const [data, setData] = useState<DashboardData>(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/sheets?tab=all&_t=${Date.now()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData({
                vendas: json.vendas || [],
                facebook: json.facebook || [],
                geral: json.geral || [],
            });
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            setData(EMPTY_DATA);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, lastUpdated, refresh: fetchData };
}
