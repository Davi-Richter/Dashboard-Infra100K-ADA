"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import { DonutChartGlass } from "@/components/charts/donut-chart-glass";
import { AreaChartGlass } from "@/components/charts/area-chart-glass";
import { Play, Eye, Clapperboard, Film, Video } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import * as calc from "@/lib/calculations";

export default function CriativosPage() {
    const { filtered } = useDashboard();
    const { facebook } = filtered;

    const adMetrics = useMemo(() => calc.calcAdMetrics(facebook), [facebook]);

    // Top 10 by conversion
    const top10Columns = [
        { key: "adName", label: "Anúncio" },
        { key: "compras", label: "Compras", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "investimento", label: "Invest.", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "impressoes", label: "Impressões", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "cliques", label: "Cliques", align: "right" as const, format: (v: unknown) => formatNumber(v as number) },
        { key: "ctr", label: "CTR(%)", align: "right" as const, format: (v: unknown) => formatPercent(v as number) },
        { key: "cpa", label: "CPA", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "roas", label: "ROAS", align: "right" as const, format: (v: unknown) => `${(v as number).toFixed(2)}x` },
    ];

    // Device distribution
    const deviceData = useMemo(() => {
        const map = new Map<string, number>();
        facebook.forEach((r) => {
            if (r.devicePlatform) map.set(r.devicePlatform, (map.get(r.devicePlatform) || 0) + r.impressions);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [facebook]);

    // Video retention
    const videoRetention = useMemo(() => {
        const plays = facebook.reduce((s, r) => s + r.videoPlays, 0);
        const w25 = facebook.reduce((s, r) => s + r.videoWatches25, 0);
        const w50 = facebook.reduce((s, r) => s + r.videoWatches50, 0);
        const w75 = facebook.reduce((s, r) => s + r.videoWatches75, 0);
        const w95 = facebook.reduce((s, r) => s + r.videoWatches95, 0);

        const retentionData = [
            { etapa: "Início", retencao: 100, absoluto: plays },
            { etapa: "25%", retencao: plays > 0 ? (w25 / plays) * 100 : 0, absoluto: w25 },
            { etapa: "50%", retencao: plays > 0 ? (w50 / plays) * 100 : 0, absoluto: w50 },
            { etapa: "75%", retencao: plays > 0 ? (w75 / plays) * 100 : 0, absoluto: w75 },
            { etapa: "95%", retencao: plays > 0 ? (w95 / plays) * 100 : 0, absoluto: w95 },
        ];

        return { data: retentionData, plays, w25, w50, w75, w95 };
    }, [facebook]);

    // All ads table
    const allAdsColumns = [
        ...top10Columns,
        { key: "vcr", label: "VCR(%)", align: "right" as const, format: (v: unknown) => formatPercent(v as number) },
    ];

    return (
        <>
            <PageHeader
                title="Análise de Criativos"
                subtitle="Descubra quais anúncios performam melhor"
            />

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <SectionHeader title="Top 10 Anúncios por Conversão" />
                        <DataTable
                            data={adMetrics.slice(0, 10) as unknown as Record<string, unknown>[]}
                            columns={top10Columns}
                            maxHeight={450}
                        />
                    </div>
                    <GlassCard>
                        <SectionHeader title="Distribuição por Dispositivo" />
                        <DonutChartGlass data={deviceData} />
                    </GlassCard>
                </div>

                <GlassCard>
                    <SectionHeader title="Curva de Retenção de Vídeo (Geral)" />
                    <AreaChartGlass
                        data={videoRetention.data}
                        xKey="etapa"
                        yKeys={["retencao"]}
                        labels={["Retenção %"]}
                        height={300}
                        formatValue={(v) => `${v.toFixed(1)}%`}
                    />
                    <KpiRow cols={5}>
                        <KpiCard icon={Play} label="Video Plays" value={formatNumber(videoRetention.plays)} />
                        <KpiCard icon={Eye} label="25%" value={formatNumber(videoRetention.w25)} />
                        <KpiCard icon={Clapperboard} label="50%" value={formatNumber(videoRetention.w50)} />
                        <KpiCard icon={Film} label="75%" value={formatNumber(videoRetention.w75)} />
                        <KpiCard icon={Video} label="95%" value={formatNumber(videoRetention.w95)} />
                    </KpiRow>
                </GlassCard>

                <div>
                    <SectionHeader title="Todos os Anúncios" />
                    <DataTable
                        data={adMetrics as unknown as Record<string, unknown>[]}
                        columns={allAdsColumns}
                        maxHeight={500}
                    />
                </div>
            </div>
        </>
    );
}
