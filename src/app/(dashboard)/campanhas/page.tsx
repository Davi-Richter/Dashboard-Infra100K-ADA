"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import { FunnelChartGlass } from "@/components/charts/funnel-chart-glass";
import { BarChartGlass } from "@/components/charts/bar-chart-glass";
import { HorizontalBarGlass } from "@/components/charts/horizontal-bar-glass";
import { DollarSign, Eye, MousePointerClick, Percent, Banknote, CreditCard } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import * as calc from "@/lib/calculations";

export default function CampanhasPage() {
    const { filtered } = useDashboard();
    const { facebook } = filtered;

    const kpis = useMemo(() => {
        const investido = facebook.reduce((s, r) => s + r.amountSpent, 0);
        const impressoes = facebook.reduce((s, r) => s + r.impressions, 0);
        const cliques = facebook.reduce((s, r) => s + r.linkClicks, 0);
        return {
            investido,
            impressoes,
            cliques,
            ctr: calc.ctr(cliques, impressoes),
            cpm: calc.cpm(investido, impressoes),
            cpc: calc.cpc(investido, cliques),
        };
    }, [facebook]);

    // Funnel
    const funnelStages = useMemo(() => {
        const imp = facebook.reduce((s, r) => s + r.impressions, 0);
        const clk = facebook.reduce((s, r) => s + r.linkClicks, 0);
        const lp = facebook.reduce((s, r) => s + r.landingPageViews, 0);
        const co = facebook.reduce((s, r) => s + r.checkoutsInitiated, 0);
        const pu = facebook.reduce((s, r) => s + r.purchases, 0);
        return [
            { name: "Impressões", value: imp },
            { name: "Cliques", value: clk },
            { name: "Landing Page", value: lp },
            { name: "Checkout", value: co },
            { name: "Compra", value: pu },
        ];
    }, [facebook]);

    // Investimento por objetivo
    const objData = useMemo(() => {
        const map = new Map<string, number>();
        facebook.forEach((r) => {
            if (r.objective) map.set(r.objective, (map.get(r.objective) || 0) + r.amountSpent);
        });
        return Array.from(map.entries())
            .map(([obj, val]) => ({ objetivo: obj, investimento: val }))
            .sort((a, b) => b.investimento - a.investimento);
    }, [facebook]);

    // Campaign metrics
    const campanhas = useMemo(() => calc.calcCampaignMetrics(facebook), [facebook]);

    // ROAS chart data
    const roasData = useMemo(() => {
        return campanhas
            .filter((c) => c.roas > 0)
            .slice(0, 15)
            .map((c) => ({ campanha: c.campaignName, roas: parseFloat(c.roas.toFixed(2)) }));
    }, [campanhas]);

    // Best ROAS campaign
    const bestRoas = useMemo(() => {
        return campanhas.reduce((best, c) => (c.roas > best.roas ? c : best), campanhas[0]);
    }, [campanhas]);

    const tableColumns = [
        { key: "campaignName", label: "Campanha" },
        { key: "investimento", label: "Investimento", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "impressoes", label: "Impressões", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "cliques", label: "Cliques", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "compras", label: "Compras", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "receita", label: "Receita", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "ctr", label: "CTR(%)", align: "right" as const, format: (v: unknown) => formatPercent(v as number) },
        { key: "cpc", label: "CPC", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "cpa", label: "CPA", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "roas", label: "ROAS", align: "right" as const, format: (v: unknown) => `${(v as number).toFixed(2)}x` },
    ];

    return (
        <>
            <PageHeader
                title="Performance de Campanhas"
                subtitle="Analise o desempenho de cada campanha no Meta Ads"
            />

            <div className="space-y-6">
                <KpiRow cols={3}>
                    <KpiCard icon={DollarSign} label="Total Investido" value={formatCurrency(kpis.investido)} />
                    <KpiCard icon={Eye} label="Impressões" value={formatNumber(kpis.impressoes)} />
                    <KpiCard icon={MousePointerClick} label="Cliques" value={formatNumber(kpis.cliques)} />
                </KpiRow>
                <KpiRow cols={3}>
                    <KpiCard icon={Percent} label="CTR" value={formatPercent(kpis.ctr)} />
                    <KpiCard icon={Banknote} label="CPM" value={formatCurrency(kpis.cpm)} />
                    <KpiCard icon={CreditCard} label="CPC" value={formatCurrency(kpis.cpc)} />
                </KpiRow>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Funil de Conversão" />
                        <FunnelChartGlass stages={funnelStages} />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="Investimento por Objetivo" />
                        <BarChartGlass
                            data={objData}
                            xKey="objetivo"
                            yKey="investimento"
                            color="rgba(59,130,246,0.7)"
                            formatValue={(v) => formatCurrency(v)}
                        />
                    </GlassCard>
                </div>

                <GlassCard>
                    <SectionHeader title="ROAS por Campanha" />
                    <HorizontalBarGlass
                        data={roasData}
                        nameKey="campanha"
                        valueKey="roas"
                        color="#22c55e"
                        height={Math.max(roasData.length * 35, 200)}
                    />
                </GlassCard>

                <div>
                    <SectionHeader title="Detalhamento por Campanha" />
                    <DataTable
                        data={campanhas as unknown as Record<string, unknown>[]}
                        columns={tableColumns}
                        maxHeight={500}
                        highlightKey="campaignName"
                        highlightValue={bestRoas?.campaignName}
                    />
                </div>
            </div>
        </>
    );
}
