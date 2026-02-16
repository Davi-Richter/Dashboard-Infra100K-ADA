// ─── Business Constants ──────────────────────────────────────────

export const SPREADSHEET_ID = "1hKgOMFjkY5XKsrjuG0B4v8emi_WfDVLLoOfkzK2jiJY";

export const SHEET_URL_TEMPLATE =
    "https://docs.google.com/spreadsheets/d/{spreadsheetId}/gviz/tq?tqx=out:csv&sheet={sheetName}";

export const SHEETS = {
    geral: "Geral",
    vendas: "Vendas",
    facebook: "Facebook",
} as const;

export const PLATFORM_FEE_RATE = 0.0707;
export const DATA_START_DATE = "2026-01-27";
export const CACHE_TTL = 300; // 5 min

// ─── DDD → Estado ────────────────────────────────────────────────

export const DDD_ESTADO: Record<string, string> = {
    "11": "SP", "12": "SP", "13": "SP", "14": "SP", "15": "SP",
    "16": "SP", "17": "SP", "18": "SP", "19": "SP",
    "21": "RJ", "22": "RJ", "24": "RJ",
    "27": "ES", "28": "ES",
    "31": "MG", "32": "MG", "33": "MG", "34": "MG", "35": "MG",
    "37": "MG", "38": "MG",
    "41": "PR", "42": "PR", "43": "PR", "44": "PR", "45": "PR", "46": "PR",
    "47": "SC", "48": "SC", "49": "SC",
    "51": "RS", "53": "RS", "54": "RS", "55": "RS",
    "61": "DF",
    "62": "GO", "64": "GO", "63": "TO",
    "65": "MT", "66": "MT", "67": "MS",
    "68": "AC", "69": "RO",
    "71": "BA", "73": "BA", "74": "BA", "75": "BA", "77": "BA",
    "79": "SE",
    "81": "PE", "87": "PE", "82": "AL", "83": "PB", "84": "RN",
    "85": "CE", "88": "CE", "86": "PI", "89": "PI",
    "91": "PA", "93": "PA", "94": "PA",
    "92": "AM", "97": "AM", "95": "RR", "96": "AP",
    "98": "MA", "99": "MA",
};

// ─── Chart colors ────────────────────────────────────────────────

export const CHART_COLORS = [
    "#ffffff",                        // branco puro (série principal)
    "rgba(59, 130, 246, 0.9)",       // azul accent
    "rgba(255, 255, 255, 0.45)",
    "rgba(255, 255, 255, 0.25)",
    "rgba(255, 255, 255, 0.15)",
    "rgba(255, 255, 255, 0.08)",
];

// ─── Geral column layout (32 cols) ──────────────────────────────

export const GERAL_COLUMNS = [
    "_empty", "DIA",
    "FAT_P1", "QTD_P1", "REEMB_P1", "QTD_REEMB_P1", "PCT_REEMB_P1",
    "FAT_P2", "QTD_P2", "REEMB_P2", "QTD_REEMB_P2", "PCT_REEMB_P2",
    "FAT_P3", "QTD_P3", "REEMB_P3", "QTD_REEMB_P3", "PCT_REEMB_P3",
    "FAT_P4", "QTD_P4", "REEMB_P4", "QTD_REEMB_P4", "PCT_REEMB_P4",
    "QTD_TOTAL", "REEMBOLSO_TOTAL", "INVESTIMENTO", "_separator",
    "FATURAMENTO_TOTAL", "TAXA_PLATAFORMA", "LUCRO", "ROAS", "CPA", "TICKET_MEDIO",
] as const;

export const GERAL_CURRENCY_COLS = [
    "FAT_P1", "REEMB_P1", "FAT_P2", "REEMB_P2",
    "FAT_P3", "REEMB_P3", "FAT_P4", "REEMB_P4",
    "REEMBOLSO_TOTAL", "INVESTIMENTO",
    "FATURAMENTO_TOTAL", "TAXA_PLATAFORMA", "LUCRO",
    "CPA", "TICKET_MEDIO",
];

export const GERAL_NUMERIC_COLS = [
    "QTD_P1", "QTD_REEMB_P1",
    "QTD_P2", "QTD_REEMB_P2",
    "QTD_P3", "QTD_REEMB_P3",
    "QTD_P4", "QTD_REEMB_P4",
    "QTD_TOTAL",
];

// ─── Days of week PT-BR ──────────────────────────────────────────

export const DIAS_SEMANA: Record<number, string> = {
    0: "Domingo",
    1: "Segunda",
    2: "Terça",
    3: "Quarta",
    4: "Quinta",
    5: "Sexta",
    6: "Sábado",
};
