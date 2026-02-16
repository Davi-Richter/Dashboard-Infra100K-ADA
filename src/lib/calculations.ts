import type { FacebookRow, CampaignMetrics, AdMetrics } from "@/types/dashboard";
import { PLATFORM_FEE_RATE } from "./constants";

// ─── Safe division ───────────────────────────────────────────────

function safeDivide(a: number, b: number): number {
    return b === 0 ? 0 : a / b;
}

// ─── Basic metrics ───────────────────────────────────────────────

export function ctr(clicks: number, impressions: number): number {
    return safeDivide(clicks, impressions) * 100;
}

export function cpm(spent: number, impressions: number): number {
    return safeDivide(spent, impressions) * 1000;
}

export function cpc(spent: number, clicks: number): number {
    return safeDivide(spent, clicks);
}

export function cpa(spent: number, purchases: number): number {
    return safeDivide(spent, purchases);
}

export function roas(revenue: number, spent: number): number {
    return safeDivide(revenue, spent);
}

export function conversionRate(purchases: number, clicks: number): number {
    return safeDivide(purchases, clicks) * 100;
}

export function lucro(
    faturamento: number,
    investimento: number,
    feeRate: number = PLATFORM_FEE_RATE
): number {
    return faturamento - faturamento * feeRate - investimento;
}

export function margem(lucroValue: number, faturamento: number): number {
    return safeDivide(lucroValue, faturamento) * 100;
}

export function vcr(videoViews95: number, videoPlays: number): number {
    return safeDivide(videoViews95, videoPlays) * 100;
}

export function ticketMedio(faturamento: number, vendas: number): number {
    return safeDivide(faturamento, vendas);
}

// ─── Campaign aggregation ────────────────────────────────────────

export function calcCampaignMetrics(data: FacebookRow[]): CampaignMetrics[] {
    const map = new Map<string, {
        investimento: number; impressoes: number; cliques: number;
        compras: number; receita: number; landingPages: number; checkouts: number;
    }>();

    for (const row of data) {
        const key = row.campaignName;
        const acc = map.get(key) || {
            investimento: 0, impressoes: 0, cliques: 0,
            compras: 0, receita: 0, landingPages: 0, checkouts: 0,
        };
        acc.investimento += row.amountSpent;
        acc.impressoes += row.impressions;
        acc.cliques += row.linkClicks;
        acc.compras += row.purchases;
        acc.receita += row.purchasesConversionValue;
        acc.landingPages += row.landingPageViews;
        acc.checkouts += row.checkoutsInitiated;
        map.set(key, acc);
    }

    return Array.from(map.entries())
        .map(([campaignName, a]) => ({
            campaignName,
            ...a,
            ctr: ctr(a.cliques, a.impressoes),
            cpm: cpm(a.investimento, a.impressoes),
            cpc: cpc(a.investimento, a.cliques),
            cpa: cpa(a.investimento, a.compras),
            roas: roas(a.receita, a.investimento),
        }))
        .sort((a, b) => b.investimento - a.investimento);
}

// ─── Ad aggregation ──────────────────────────────────────────────

export function calcAdMetrics(data: FacebookRow[]): AdMetrics[] {
    const map = new Map<string, {
        investimento: number; impressoes: number; cliques: number;
        compras: number; receita: number; videoPlays: number;
        videoWatches25: number; videoWatches50: number;
        videoWatches75: number; videoWatches95: number;
    }>();

    for (const row of data) {
        const key = row.adName;
        const acc = map.get(key) || {
            investimento: 0, impressoes: 0, cliques: 0,
            compras: 0, receita: 0, videoPlays: 0,
            videoWatches25: 0, videoWatches50: 0,
            videoWatches75: 0, videoWatches95: 0,
        };
        acc.investimento += row.amountSpent;
        acc.impressoes += row.impressions;
        acc.cliques += row.linkClicks;
        acc.compras += row.purchases;
        acc.receita += row.purchasesConversionValue;
        acc.videoPlays += row.videoPlays;
        acc.videoWatches25 += row.videoWatches25;
        acc.videoWatches50 += row.videoWatches50;
        acc.videoWatches75 += row.videoWatches75;
        acc.videoWatches95 += row.videoWatches95;
        map.set(key, acc);
    }

    return Array.from(map.entries())
        .map(([adName, a]) => ({
            adName,
            ...a,
            ctr: ctr(a.cliques, a.impressoes),
            cpa: cpa(a.investimento, a.compras),
            roas: roas(a.receita, a.investimento),
            vcr: vcr(a.videoWatches95, a.videoPlays),
        }))
        .sort((a, b) => b.compras - a.compras);
}
