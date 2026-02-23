"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { AreaChartGlass } from "@/components/charts/area-chart-glass";
import { BarChartGlass } from "@/components/charts/bar-chart-glass";
import { DonutChartGlass } from "@/components/charts/donut-chart-glass";
import { HorizontalBarGlass } from "@/components/charts/horizontal-bar-glass";
import {
    DollarSign,
    TrendingUp,
    BarChart3,
    ShoppingCart,
    Target,
    Receipt,
    Wallet,
} from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import * as calc from "@/lib/calculations";
import { ORGANIC_PRODUCTS } from "@/lib/constants";
import { format } from "date-fns";

export default function VisaoExecutivaPage() {
    const { filtered } = useDashboard();
    const { vendas, facebook, geral } = filtered;

    // ─── KPIs ────────────────────────────────────────────────────
    const kpis = useMemo(() => {
        const faturamento = geral.reduce((s, r) => s + r.faturamentoTotal, 0);
        const totalVendas = vendas.length;
        const investimento = facebook.reduce((s, r) => s + r.amountSpent, 0);
        const lucroVal = calc.lucro(faturamento, investimento);
        const ticket = calc.ticketMedio(faturamento, totalVendas);

        // Separa métricas Orgânicas para CPA/ROAS mais precisos
        const vendasAds = vendas.filter(v => !ORGANIC_PRODUCTS.includes(v.produto));
        const totalVendasAds = vendasAds.length;
        const receitaAds = vendasAds.reduce((s, v) => s + v.valor, 0);

        const roasVal = calc.roas(receitaAds, investimento);
        const cpaVal = calc.cpa(investimento, totalVendasAds);

        return { faturamento, totalVendas, investimento, lucro: lucroVal, roas: roasVal, ticket, cpa: cpaVal };
    }, [vendas, facebook, geral]);

    // ─── Chart data ──────────────────────────────────────────────
    const dailyData = useMemo(() => {
        return geral
            .sort((a, b) => a.data.localeCompare(b.data))
            .map((r) => ({
                data: format(new Date(r.data), "dd/MM"),
                Faturamento: r.faturamentoTotal,
                Investimento: r.investimento,
            }));
    }, [geral]);

    const produtoData = useMemo(() => {
        const map = new Map<string, number>();
        vendas.forEach((v) => {
            map.set(v.produto, (map.get(v.produto) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [vendas]);

    const diaDaSemanaData = useMemo(() => {
        const order = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
        const map = new Map<string, number>();
        order.forEach((d) => map.set(d, 0));
        vendas.forEach((v) => {
            map.set(v.diaDaSemana, (map.get(v.diaDaSemana) || 0) + 1);
        });
        return order.map((dia) => ({ dia, vendas: map.get(dia) || 0 }));
    }, [vendas]);

    const topEstados = useMemo(() => {
        const map = new Map<string, number>();
        vendas.forEach((v) => {
            if (v.estado !== "Outro") {
                map.set(v.estado, (map.get(v.estado) || 0) + v.valor);
            }
        });
        return Array.from(map.entries())
            .map(([estado, valor]) => ({ estado, valor }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 10);
    }, [vendas]);

    return (
        <>
            <PageHeader
                title="Visão Executiva"
                subtitle="Acompanhe o desempenho geral de vendas e campanhas"
            />

            <div className="space-y-6">
                {/* KPIs Row 1 */}
                <KpiRow cols={4}>
                    <KpiCard icon={DollarSign} label="Faturamento" value={formatCurrency(kpis.faturamento)} />
                    <KpiCard icon={TrendingUp} label="Lucro Líquido" value={formatCurrency(kpis.lucro)}
                        deltaType={kpis.lucro >= 0 ? "positive" : "negative"} />
                    <KpiCard icon={BarChart3} label="ROAS" value={`${kpis.roas.toFixed(2)}x`} />
                    <KpiCard icon={ShoppingCart} label="Vendas" value={formatNumber(kpis.totalVendas)} />
                </KpiRow>

                {/* KPIs Row 2 */}
                <KpiRow cols={3}>
                    <KpiCard icon={Target} label="Investimento Ads" value={formatCurrency(kpis.investimento)} />
                    <KpiCard icon={Receipt} label="Ticket Médio" value={formatCurrency(kpis.ticket)} />
                    <KpiCard icon={Wallet} label="CPA" value={formatCurrency(kpis.cpa)} />
                </KpiRow>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Faturamento vs Investimento" />
                        <AreaChartGlass
                            data={dailyData}
                            xKey="data"
                            yKeys={["Faturamento", "Investimento"]}
                            labels={["Faturamento", "Investimento"]}
                            formatValue={(v) => formatCurrency(v)}
                        />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="Vendas por Produto" />
                        <DonutChartGlass data={produtoData} />
                    </GlassCard>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Vendas por Dia da Semana" />
                        <BarChartGlass
                            data={diaDaSemanaData}
                            xKey="dia"
                            yKey="vendas"
                            color="rgba(255,255,255,0.6)"
                        />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="Top 10 Regiões (DDD)" />
                        <HorizontalBarGlass
                            data={topEstados}
                            nameKey="estado"
                            valueKey="valor"
                            color="#22c55e"
                            formatValue={(v) => formatCurrency(v)}
                        />
                    </GlassCard>
                </div>
            </div>
        </>
    );
}
