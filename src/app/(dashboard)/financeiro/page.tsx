"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { WaterfallChartGlass } from "@/components/charts/waterfall-chart-glass";
import { GaugeChartGlass } from "@/components/charts/gauge-chart-glass";
import { AreaChartGlass } from "@/components/charts/area-chart-glass";
import { BarChartGlass } from "@/components/charts/bar-chart-glass";
import { DollarSign, CreditCard, Wallet, TrendingUp, Percent } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { PLATFORM_FEE_RATE } from "@/lib/constants";
import * as calc from "@/lib/calculations";
import { format } from "date-fns";

export default function FinanceiroPage() {
    const { filtered } = useDashboard();
    const { geral, facebook } = filtered;

    const kpis = useMemo(() => {
        const receita = geral.reduce((s, r) => s + r.faturamentoTotal, 0);
        const taxa = receita * PLATFORM_FEE_RATE;
        const custoAds = facebook.reduce((s, r) => s + r.amountSpent, 0);
        const lucroVal = receita - taxa - custoAds;
        const margemVal = calc.margem(lucroVal, receita);
        const roasVal = calc.roas(receita, custoAds);

        return { receita, taxa, custoAds, lucro: lucroVal, margem: margemVal, roas: roasVal };
    }, [geral, facebook]);

    // Waterfall
    const waterfallItems = useMemo(() => [
        { name: "Receita Bruta", value: kpis.receita, type: "absolute" as const },
        { name: "Taxa Plataforma", value: -kpis.taxa, type: "relative" as const },
        { name: "Custo Ads", value: -kpis.custoAds, type: "relative" as const },
        { name: "Lucro", value: kpis.lucro, type: "total" as const },
    ], [kpis]);

    // Daily lucro
    const dailyLucro = useMemo(() => {
        const sorted = [...geral].sort((a, b) => a.data.localeCompare(b.data));

        // Group Facebook by date for daily investment
        const fbByDate = new Map<string, number>();
        facebook.forEach((r) => {
            fbByDate.set(r.data, (fbByDate.get(r.data) || 0) + r.amountSpent);
        });

        let cumsum = 0;
        return sorted.map((r) => {
            const invest = fbByDate.get(r.data) || r.investimento;
            const lucro = r.lucro || (r.faturamentoTotal - r.faturamentoTotal * PLATFORM_FEE_RATE - invest);
            cumsum += lucro;
            return {
                data: format(new Date(r.data), "dd/MM"),
                "Lucro Diário": parseFloat(lucro.toFixed(2)),
                "Acumulado": parseFloat(cumsum.toFixed(2)),
            };
        });
    }, [geral, facebook]);

    // Projection
    const projection = useMemo(() => {
        const nDays = geral.length || 1;
        const fatProj = (kpis.receita / nDays) * 30;
        const invProj = (kpis.custoAds / nDays) * 30;
        const lucProj = (kpis.lucro / nDays) * 30;

        return {
            fatProj, invProj, lucProj,
            chartData: [
                { tipo: "Faturamento", Realizado: kpis.receita, Projetado: fatProj },
                { tipo: "Investimento", Realizado: kpis.custoAds, Projetado: invProj },
                { tipo: "Lucro", Realizado: kpis.lucro, Projetado: lucProj },
            ],
        };
    }, [geral, kpis]);

    return (
        <>
            <PageHeader
                title="Análise Financeira"
                subtitle="Acompanhe a saúde financeira do negócio"
            />

            <div className="space-y-6">
                <KpiRow cols={3}>
                    <KpiCard icon={DollarSign} label="Receita Bruta" value={formatCurrency(kpis.receita)} />
                    <KpiCard icon={CreditCard} label="Taxa Plataforma 7,07%" value={formatCurrency(kpis.taxa)} />
                    <KpiCard icon={Wallet} label="Custo Ads" value={formatCurrency(kpis.custoAds)} />
                </KpiRow>
                <KpiRow cols={2}>
                    <KpiCard icon={TrendingUp} label="Lucro Líquido" value={formatCurrency(kpis.lucro)}
                        deltaType={kpis.lucro >= 0 ? "positive" : "negative"} />
                    <KpiCard icon={Percent} label="Margem de Lucro" value={formatPercent(kpis.margem)}
                        deltaType={kpis.margem >= 15 ? "positive" : kpis.margem >= 0 ? "neutral" : "negative"} />
                </KpiRow>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Composição do Lucro" />
                        <WaterfallChartGlass items={waterfallItems} height={300} />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="ROAS Atual vs Meta" />
                        <GaugeChartGlass
                            value={kpis.roas}
                            reference={3.0}
                            max={Math.max(kpis.roas * 1.5, 10)}
                            suffix="x"
                        />
                    </GlassCard>
                </div>

                <GlassCard>
                    <SectionHeader title="Lucro Diário e Acumulado" />
                    <AreaChartGlass
                        data={dailyLucro}
                        xKey="data"
                        yKeys={["Lucro Diário", "Acumulado"]}
                        labels={["Lucro Diário", "Acumulado"]}
                        formatValue={(v) => formatCurrency(v)}
                    />
                </GlassCard>

                <GlassCard>
                    <SectionHeader title="Projeção Mensal (baseada na média diária)" />
                    <KpiRow cols={3}>
                        <KpiCard icon={DollarSign} label="Fat. Projetado 30d" value={formatCurrency(projection.fatProj)} />
                        <KpiCard icon={Wallet} label="Invest. Projetado 30d" value={formatCurrency(projection.invProj)} />
                        <KpiCard icon={TrendingUp} label="Lucro Projetado 30d" value={formatCurrency(projection.lucProj)} />
                    </KpiRow>
                    <div className="mt-4">
                        <BarChartGlass
                            data={projection.chartData}
                            xKey="tipo"
                            yKey="Realizado"
                            color="rgba(255,255,255,0.6)"
                            formatValue={(v) => formatCurrency(v)}
                            height={300}
                        />
                    </div>
                </GlassCard>
            </div>
        </>
    );
}
