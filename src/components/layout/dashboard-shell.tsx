"use client";

import { ReactNode, useMemo } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useFilters, filterVendas, filterFacebook, filterGeral } from "@/hooks/use-filters";
import { usePathname } from "next/navigation";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MultiSelectFilter } from "@/components/filters/multi-select-filter";
import { Menu, X } from "lucide-react";
import type { DashboardData } from "@/types/dashboard";

interface DashboardContextValue {
    data: DashboardData;
    filtered: DashboardData;
    loading: boolean;
    error: string | null;
}

import { createContext, useContext, useState } from "react";

const DashboardContext = createContext<DashboardContextValue>({
    data: { vendas: [], facebook: [], geral: [] },
    filtered: { vendas: [], facebook: [], geral: [] },
    loading: true,
    error: null,
});

export function useDashboard() {
    return useContext(DashboardContext);
}

export function DashboardShell({ children }: { children: ReactNode }) {
    const { data, loading, error, lastUpdated, refresh } = useDashboardData();
    const { filters, setDateRange, setProdutos, setCampanhas, setObjetivos } = useFilters();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const filtered = useMemo(
        () => ({
            vendas: filterVendas(data.vendas, filters),
            facebook: filterFacebook(data.facebook, filters),
            geral: filterGeral(data.geral, filters),
        }),
        [data, filters]
    );

    // Derive filter options from data
    const produtoOptions = useMemo(() => {
        return [...new Set(data.vendas.map((v) => v.produto))].filter(Boolean).sort();
    }, [data.vendas]);

    const campanhaOptions = useMemo(() => {
        return [...new Set(data.facebook.map((f) => f.campaignName))].filter(Boolean).sort();
    }, [data.facebook]);

    const objetivoOptions = useMemo(() => {
        return [...new Set(data.facebook.map((f) => f.objective))].filter(Boolean).sort();
    }, [data.facebook]);

    // Filter visibility
    const showProduto = ["/visao-executiva", "/clientes"].includes(pathname);
    const showCampanha = ["/campanhas", "/criativos"].includes(pathname);
    const showObjetivo = pathname === "/campanhas";

    return (
        <DashboardContext.Provider value={{ data, filtered, loading, error }}>
            <div className="flex min-h-screen relative">
                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#09091b]/95 border-b border-white/5 backdrop-blur-md z-50 flex items-center px-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -ml-2 text-white/70 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="ml-2 font-semibold text-text-primary">Acadêmia da aprovação</span>
                </div>

                {/* Sidebar Overlay for Mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <div className={`
                    fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}>
                    <Sidebar
                        connected={!error && !loading}
                        lastUpdated={lastUpdated}
                        onRefresh={refresh}
                        loading={loading}
                        isCollapsed={isSidebarCollapsed}
                        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <div className="space-y-4">
                            <DateRangePicker
                                from={filters.dateRange.from}
                                to={filters.dateRange.to}
                                onChange={setDateRange}
                            />
                            {showProduto && (
                                <MultiSelectFilter
                                    label="Produto"
                                    options={produtoOptions}
                                    selected={filters.produtos}
                                    onChange={setProdutos}
                                />
                            )}
                            {showCampanha && (
                                <MultiSelectFilter
                                    label="Campanha"
                                    options={campanhaOptions}
                                    selected={filters.campanhas}
                                    onChange={setCampanhas}
                                />
                            )}
                            {showObjetivo && (
                                <MultiSelectFilter
                                    label="Objetivo"
                                    options={objetivoOptions}
                                    selected={filters.objetivos}
                                    onChange={setObjetivos}
                                />
                            )}
                        </div>
                    </Sidebar>
                </div>

                <main className={`
                    flex-1 p-4 md:p-8 min-h-screen pt-20 md:pt-8 transition-all duration-300
                    ${isSidebarCollapsed ? "md:ml-[80px]" : "md:ml-[260px]"}
                    ml-0
                `}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-text-secondary">Carregando dados...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                            <p className="text-negative text-lg">Erro ao carregar dados</p>
                            <p className="text-text-tertiary text-sm">{error}</p>
                            <button onClick={refresh} className="btn-accent mt-4">
                                Tentar novamente
                            </button>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </DashboardContext.Provider>
    );
}
