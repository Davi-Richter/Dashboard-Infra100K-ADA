import { parse, isValid, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type {
    RawVendaRow,
    RawFacebookRow,
    Venda,
    FacebookRow,
    GeralRow,
} from "@/types/dashboard";
import { parseCurrency } from "./formatters";
import {
    DDD_ESTADO,
    DATA_START_DATE,
    GERAL_COLUMNS,
    GERAL_CURRENCY_COLS,
    GERAL_NUMERIC_COLS,
    DIAS_SEMANA,
} from "./constants";

// ─── Vendas ──────────────────────────────────────────────────────

export function processVendas(rows: RawVendaRow[]): Venda[] {
    return rows
        .filter((row) => {
            const status = (row["Status"] || "").trim().toLowerCase();
            return status === "aprovado";
        })
        .map((row) => {
            const dateStr = (row["Data da compra"] || "").trim();
            const dateObj = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
            const isValidDate = isValid(dateObj);

            const celular = String(row["Celular"] || "").trim();
            const ddd = celular.length >= 4 ? celular.substring(2, 4) : "";
            const estado = DDD_ESTADO[ddd] || "Outro";

            const fillUtm = (v: string) => {
                const trimmed = (v || "").trim();
                return trimmed === "" ? "Direto / Orgânico" : trimmed;
            };

            return {
                dataCompra: isValidDate ? dateObj : new Date(0),
                data: isValidDate ? format(dateObj, "yyyy-MM-dd") : "",
                hora: isValidDate ? dateObj.getHours() : 0,
                diaDaSemana: isValidDate
                    ? DIAS_SEMANA[dateObj.getDay()] || "Outro"
                    : "Outro",
                nome: (row["Nome do comprador"] || "").trim(),
                produto: (row["Produto comprado"] || "").trim(),
                valor: parseCurrency(row["Valor Venda"]),
                celular,
                ddd,
                estado,
                utmCampaign: fillUtm(row["UTM Campaign"]),
                utmMedium: fillUtm(row["UTM Medium"]),
                utmSource: fillUtm(row["UTM Source"]),
                utmContent: fillUtm(row["UTM Content"]),
                utmTerm: fillUtm(row["UTM Term"]),
            };
        })
        .filter((v) => v.data !== "");
}

// ─── Facebook ────────────────────────────────────────────────────

function toInt(v: string | number | undefined): number {
    if (v === undefined || v === null || v === "") return 0;
    const n = Number(v);
    return isNaN(n) ? 0 : Math.round(n);
}

export function processFacebook(rows: RawFacebookRow[]): FacebookRow[] {
    const cutoff = new Date(DATA_START_DATE);

    return rows
        .map((row) => {
            const dayStr = (row["Day"] || "").trim();
            const day = new Date(dayStr);
            if (!isValid(day)) return null;

            return {
                day,
                data: format(day, "yyyy-MM-dd"),
                campaignName: (row["Campaign Name"] || "").trim(),
                adSetName: (row["Ad Set Name"] || "").trim(),
                adName: (row["Ad Name"] || "").trim(),
                objective: (row["Objective"] || "").trim(),
                devicePlatform: (row["Device Platform"] || "").trim(),
                amountSpent: parseCurrency(row["Amount Spent"]),
                purchasesConversionValue: parseCurrency(row["Purchases Conversion Value"]),
                leads: toInt(row["Leads"]),
                purchases: toInt(row["Purchases"]),
                checkoutsInitiated: toInt(row["Checkouts Initiated"]),
                addsToCart: toInt(row["Adds to Cart"]),
                landingPageViews: toInt(row["Landing Page Views"]),
                linkClicks: toInt(row["Link Clicks"]),
                impressions: toInt(row["Impressions"]),
                postSaves: toInt(row["Post Saves"]),
                postShares: toInt(row["Post Shares"]),
                postComments: toInt(row["Post Comments"]),
                postReactions: toInt(row["Post Reactions"]),
                postEngagement: toInt(row["Post Engagement"]),
                pageEngagement: toInt(row["Page Engagement"]),
                messagingConversationsStarted: toInt(row["Messaging Conversations Started"]),
                videoWatches25: toInt(row["Video Watches at 25%"]),
                videoWatches50: toInt(row["Video Watches at 50%"]),
                videoWatches75: toInt(row["Video Watches at 75%"]),
                videoWatches95: toInt(row["Video Watches at 95%"]),
                videoPlays: toInt(row["Video Plays"]),
                threeSecondVideoViews: toInt(row["3-Second Video Views"]),
            };
        })
        .filter((r): r is FacebookRow => r !== null && r.day >= cutoff);
}

// ─── Geral ───────────────────────────────────────────────────────

export function processGeral(rawRows: string[][]): GeralRow[] {
    // rawRows is an array of arrays (rows × columns) from Papa.parse without header.
    // Row 0 might be auto-detected headers or totals — skip it.
    // Assign column names manually.
    const nCols = GERAL_COLUMNS.length;

    return rawRows
        .slice(1) // skip row 0 (totals)
        .map((cells) => {
            const padded = [...cells];
            while (padded.length < nCols) padded.push("");

            const get = (idx: number) => (padded[idx] || "").trim();

            // Parse date dd/MM/yy
            const diaStr = get(1);
            const dia = parse(diaStr, "dd/MM/yy", new Date());
            if (!isValid(dia)) return null;

            const pc = (idx: number) => parseCurrency(get(idx));
            const pi = (idx: number) => toInt(get(idx));

            // Parse percentuals: remove "%", replace comma with dot
            const pp = (idx: number) => {
                const v = get(idx).replace(/%/g, "").replace(",", ".").trim();
                const n = parseFloat(v);
                return isNaN(n) ? 0 : n;
            };

            // Parse ROAS
            const roasStr = get(29).replace(",", ".").trim();
            const roasVal = parseFloat(roasStr);

            return {
                dia,
                data: format(dia, "yyyy-MM-dd"),
                fatP1: pc(2), qtdP1: pi(3), reembP1: pc(4), qtdReembP1: pi(5), pctReembP1: pp(6),
                fatP2: pc(7), qtdP2: pi(8), reembP2: pc(9), qtdReembP2: pi(10), pctReembP2: pp(11),
                fatP3: pc(12), qtdP3: pi(13), reembP3: pc(14), qtdReembP3: pi(15), pctReembP3: pp(16),
                fatP4: pc(17), qtdP4: pi(18), reembP4: pc(19), qtdReembP4: pi(20), pctReembP4: pp(21),
                qtdTotal: pi(22),
                reembolsoTotal: pc(23),
                investimento: pc(24),
                faturamentoTotal: pc(26),
                taxaPlataforma: pc(27),
                lucro: pc(28),
                roas: isNaN(roasVal) ? 0 : roasVal,
                cpa: pc(30),
                ticketMedio: pc(31),
            };
        })
        .filter((r): r is GeralRow => r !== null);
}
