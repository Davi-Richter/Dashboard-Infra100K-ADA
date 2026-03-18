import { parse, isValid, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type {
    RawVendaRow,
    RawFacebookRow,
    RawAnalyticsRow,
    Venda,
    FacebookRow,
    GeralRow,
    AnalyticsRow,
} from "@/types/dashboard";
import { parseCurrency } from "./formatters";
import {
    DDD_ESTADO,
    DATA_START_DATE,
    GERAL_COLUMNS,
    GERAL_CURRENCY_COLS,
    GERAL_NUMERIC_COLS,
    DIAS_SEMANA,
    ORGANIC_PRODUCTS,
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

            const produto = (row["Produto comprado"] || "").trim();
            const utmCampaign = fillUtm(row["UTM Campaign"]);
            const utmMedium = fillUtm(row["UTM Medium"]);
            const utmSource = fillUtm(row["UTM Source"]);
            const utmContent = fillUtm(row["UTM Content"]);
            const utmTerm = fillUtm(row["UTM Term"]);

            const isOrganicProduct = ORGANIC_PRODUCTS.includes(produto);

            let isDiscursivasOrganic = false;
            if (produto === "Curso de Discursivas + Temas Inéditos") {
                const startAdsDate = new Date("2026-02-24T00:00:00");
                if (isValidDate && dateObj < startAdsDate) {
                    isDiscursivasOrganic = true;
                }
            }

            const isOrganicUtms =
                utmCampaign === "Direto / Orgânico" &&
                utmMedium === "Direto / Orgânico" &&
                utmSource === "Direto / Orgânico" &&
                utmContent === "Direto / Orgânico" &&
                utmTerm === "Direto / Orgânico";

            const sourceLower = utmSource.toLowerCase();
            const mediumLower = utmMedium.toLowerCase();
            const isWhitelistedSource =
                sourceLower.includes("youtube") ||
                sourceLower.includes("academiadaaprovacao") ||
                sourceLower.includes("google.com") ||
                (sourceLower.includes("instagram") && mediumLower.includes("org"));

            return {
                dataCompra: isValidDate ? dateObj : new Date(0),
                data: isValidDate ? format(dateObj, "yyyy-MM-dd") : "",
                hora: isValidDate ? dateObj.getHours() : 0,
                diaDaSemana: isValidDate
                    ? DIAS_SEMANA[dateObj.getDay()] || "Outro"
                    : "Outro",
                nome: (row["Nome do comprador"] || "").trim(),
                produto,
                valor: parseCurrency(row["Valor Venda"]),
                celular,
                ddd,
                estado,
                utmCampaign,
                utmMedium,
                utmSource,
                utmContent,
                utmTerm,
                isOrganic: isOrganicProduct || isDiscursivasOrganic || isOrganicUtms || isWhitelistedSource,
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

// ─── Analytics ───────────────────────────────────────────────────

export function processAnalytics(rows: string[][]): AnalyticsRow[] {
    const cutoff = new Date(DATA_START_DATE);

    // GA4 Magic Reports outputs ~8 metadata header rows before the actual data.
    // We find the first row that looks like a real data row (has a date in col[1]).
    const dataRows = rows.filter((row) => {
        const dateCandidate = (row[1] || "").trim();
        // Match "2026-03-18" or "20260318" patterns
        return /^\d{4}-\d{2}-\d{2}$/.test(dateCandidate) || (/^\d{8}$/.test(dateCandidate) && dateCandidate.length === 8);
    });

    return dataRows
        .map((row) => {
            // Positional columns from GA4 Magic Reports:
            // [0] = sessionSourceMedium  (e.g. "meta-ads / an")
            // [1] = Date                 (e.g. "2026-02-18")
            // [2] = pagePath             (e.g. "/curso-plfcd/")
            // [3] = Total users          (e.g. "2009")
            // [4] = Engagement rate      (e.g. "0,2533269962" — Brazilian comma decimal)
            // [5] = Sessions             (e.g. "2104")

            const dateStr = (row[1] || "").trim();
            let dateObj: Date;

            if (/^\d{8}$/.test(dateStr)) {
                const yyyy = dateStr.substring(0, 4);
                const mm = dateStr.substring(4, 6);
                const dd = dateStr.substring(6, 8);
                dateObj = new Date(`${yyyy}-${mm}-${dd}T12:00:00Z`);
            } else {
                dateObj = new Date(dateStr + "T12:00:00Z");
            }

            if (!isValid(dateObj)) return null;

            return {
                sourceMedium: (row[0] || "").trim(),
                date: dateObj,
                dateString: format(dateObj, "yyyy-MM-dd"),
                pagePath: (row[2] || "").trim(),
                users: toInt(row[3]),
                engagementRate: parseFloat((row[4] || "0").replace(",", ".")) || 0,
                sessions: toInt(row[5]),
            };
        })
        .filter((r): r is AnalyticsRow => r !== null && r.date >= cutoff);
}
