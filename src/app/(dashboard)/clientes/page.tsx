"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiRow } from "@/components/ui/kpi-row";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import { HorizontalBarGlass } from "@/components/charts/horizontal-bar-glass";
import { BarChartGlass } from "@/components/charts/bar-chart-glass";
import { DonutChartGlass } from "@/components/charts/donut-chart-glass";
import { Users, Receipt, Globe } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import * as calc from "@/lib/calculations";
import { format } from "date-fns";

export default function ClientesPage() {
    const { filtered } = useDashboard();
    const { vendas } = filtered;

    const kpis = useMemo(() => {
        const uniqueClients = vendas.length;
        const totalFat = vendas.reduce((s, v) => s + v.valor, 0);
        const ticket = calc.ticketMedio(totalFat, vendas.length);

        const diretoCnt = vendas.filter((v) => {
            const src = v.utmSource.toLowerCase();
            return src.includes("direto") || src.includes("orgânico") || src.includes("organi");
        }).length;
        const pctDireto = vendas.length > 0 ? (diretoCnt / vendas.length) * 100 : 0;

        return { uniqueClients, ticket, pctDireto };
    }, [vendas]);

    const utmSourceData = useMemo(() => {
        const map = new Map<string, number>();
        vendas.forEach((v) => map.set(v.utmSource, (map.get(v.utmSource) || 0) + 1));
        return Array.from(map.entries())
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [vendas]);

    const estadoData = useMemo(() => {
        const map = new Map<string, number>();
        vendas.forEach((v) => {
            if (v.estado !== "Outro") map.set(v.estado, (map.get(v.estado) || 0) + v.valor);
        });
        return Array.from(map.entries())
            .map(([estado, valor]) => ({ estado, valor }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 15);
    }, [vendas]);

    const horaData = useMemo(() => {
        const counts = Array(24).fill(0);
        vendas.forEach((v) => { counts[v.hora]++; });
        return counts.map((c, h) => ({ hora: `${h}h`, vendas: c }));
    }, [vendas]);

    const produtoData = useMemo(() => {
        const map = new Map<string, number>();
        vendas.forEach((v) => map.set(v.produto, (map.get(v.produto) || 0) + 1));
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [vendas]);

    const recentClients = useMemo(() => {
        return [...vendas]
            .sort((a, b) => new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime())
            .slice(0, 20)
            .map((v) => ({
                data: format(new Date(v.dataCompra), "dd/MM/yyyy HH:mm"),
                nome: v.nome,
                produto: v.produto,
                valor: v.valor,
                estado: v.estado,
                utmSource: v.utmSource,
            }));
    }, [vendas]);

    const tableColumns = [
        { key: "data", label: "Data" },
        { key: "nome", label: "Nome" },
        { key: "produto", label: "Produto" },
        { key: "valor", label: "Valor", align: "right" as const, format: (v: unknown) => formatCurrency(v as number) },
        { key: "estado", label: "Estado" },
        { key: "utmSource", label: "UTM Source" },
    ];

    return (
        <>
            <PageHeader
                title="Análise de Clientes"
                subtitle="Entenda o perfil e origem dos seus clientes"
            />

            <div className="space-y-6">
                <KpiRow cols={3}>
                    <KpiCard icon={Users} label="Total de Clientes" value={formatNumber(kpis.uniqueClients)} />
                    <KpiCard icon={Receipt} label="Ticket Médio" value={formatCurrency(kpis.ticket)} />
                    <KpiCard icon={Globe} label="Tráfego Direto" value={formatPercent(kpis.pctDireto)} />
                </KpiRow>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Vendas por UTM Source" />
                        <HorizontalBarGlass data={utmSourceData} nameKey="source" valueKey="count" color="rgba(255,255,255,0.6)" tooltipFormatValue={(v) => String(v)} />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="Vendas por Estado" />
                        <HorizontalBarGlass data={estadoData} nameKey="estado" valueKey="valor" color="#22c55e" formatValue={(v) => formatCurrency(v)} tooltipFormatValue={(v) => formatCurrency(v)} />
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard>
                        <SectionHeader title="Compras por Hora do Dia" />
                        <BarChartGlass data={horaData} xKey="hora" yKey="vendas" color="rgba(255,255,255,0.5)" />
                    </GlassCard>
                    <GlassCard>
                        <SectionHeader title="Vendas por Produto" />
                        <DonutChartGlass data={produtoData} />
                    </GlassCard>
                </div>

                <div>
                    <SectionHeader title="Clientes Recentes" />
                    <DataTable data={recentClients as unknown as Record<string, unknown>[]} columns={tableColumns} maxHeight={460} />
                </div>
            </div>
        </>
    );
}
