"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { AreaChartGlass } from "@/components/charts/area-chart-glass";
import { HorizontalBarGlass } from "@/components/charts/horizontal-bar-glass";
import { DonutChartGlass } from "@/components/charts/donut-chart-glass";
import { Activity, Users, MousePointerClick, Target } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { format } from "date-fns";

export default function AnalyticsPage() {
    const { filtered } = useDashboard();
    const { analytics, vendas } = filtered;

    const kpis = useMemo(() => {
        const totalVisits = analytics.reduce((acc, row) => acc + row.users, 0);
        const totalSessions = analytics.reduce((acc, row) => acc + row.sessions, 0);

        // Peso ponderado do bounce rate
        const weightedEngagement = analytics.reduce((acc, row) => acc + (row.engagementRate * row.sessions), 0);
        const avgEngagement = totalSessions > 0 ? (weightedEngagement / totalSessions) : 0;

        const totalVendasUnicas = vendas.length;
        const conversionRate = totalVisits > 0 ? (totalVendasUnicas / totalVisits) : 0;

        return { totalVisits, totalSessions, avgEngagement, conversionRate };
    }, [analytics, vendas]);

    const sessionsTimeline = useMemo(() => {
        const map = new Map<string, number>();
        analytics.forEach(row => {
            const current = map.get(row.dateString) || 0;
            map.set(row.dateString, current + row.sessions);
        });

        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, visits]) => ({
                data: format(new Date(date + "T12:00:00Z"), "dd/MM"),
                Sessões: visits
            }));
    }, [analytics]);

    const sourceData = useMemo(() => {
        const map = new Map<string, number>();
        analytics.forEach(row => {
            map.set(row.sourceMedium, (map.get(row.sourceMedium) || 0) + row.users);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [analytics]);

    const pagesData = useMemo(() => {
        const map = new Map<string, number>();
        analytics.forEach(row => {
            map.set(row.pagePath, (map.get(row.pagePath) || 0) + row.users);
        });
        return Array.from(map.entries())
            .map(([page, views]) => ({ page, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
    }, [analytics]);

    // Handle empty state gracefully if Google Sheets is not yet fully configured
    if (!analytics || analytics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Activity size={48} className="text-white/20" />
                <h2 className="text-xl font-bold text-text-primary">Aba GA4 não detectada</h2>
                <p className="text-text-tertiary text-center max-w-md">
                    O painel ainda não encontrou os dados da aba &quot;Analytics&quot; na sua planilha.
                    Certifique-se de que a automação do Google Analytics está enviando as atualizações para a planilha corretamente.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Tráfego e UX (GA4)"
                subtitle="Comportamento dos visitantes, retenção de tráfego e conversão de topo de funil"
            />

            <div className="space-y-6">
                <KpiRow cols={4}>
                    <KpiCard icon={Users} label="Total de Visitantes" value={formatNumber(kpis.totalVisits)} />
                    <KpiCard icon={MousePointerClick} label="Sessões" value={formatNumber(kpis.totalSessions)} />
                    <KpiCard icon={Activity} label="Engajamento Médio" value={formatPercent(kpis.avgEngagement * 100)} />
                    <KpiCard icon={Target} label="Taxa de Conversão" value={formatPercent(kpis.conversionRate * 100)} />
                </KpiRow>

                {/* TODO: Reativar futuramente quando GTM estiver estável
                <GlassCard>
                    <SectionHeader title="Volume de Tráfego Diário" />
                    <AreaChartGlass
                        data={sessionsTimeline}
                        xKey="data"
                        yKeys={["Sessões"]}
                        height={300}
                    />
                </GlassCard>
                */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Canais de Aquisição (Origem)" />
                        <DonutChartGlass data={sourceData} />
                    </GlassCard>

                    <GlassCard>
                        <SectionHeader title="Páginas Mais Acessadas" />
                        <HorizontalBarGlass
                            data={pagesData}
                            nameKey="page"
                            valueKey="views"
                            color="#8b5cf6"
                            tooltipFormatValue={(v) => formatNumber(v)}
                        />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
