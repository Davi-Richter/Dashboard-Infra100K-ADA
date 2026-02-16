import Papa from "papaparse";
import type { RawVendaRow, RawFacebookRow } from "@/types/dashboard";
import { SPREADSHEET_ID, SHEETS } from "./constants";

// ─── Build CSV export URL ────────────────────────────────────────

function buildUrl(sheetName: string): string {
    const encoded = encodeURIComponent(sheetName);
    return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encoded}`;
}

// ─── Fetch and parse CSV ─────────────────────────────────────────

async function fetchCsv<T>(sheetName: string, header: boolean = true): Promise<T[] | string[][]> {
    const url = buildUrl(sheetName);
    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
        throw new Error(`Failed to fetch sheet "${sheetName}": ${response.status}`);
    }

    const text = await response.text();

    if (header) {
        const result = Papa.parse<T>(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
        });
        return result.data;
    }

    // No header mode — return raw string arrays (for Geral)
    const result = Papa.parse<string[]>(text, {
        header: false,
        skipEmptyLines: true,
        dynamicTyping: false,
    });
    return result.data;
}

// ─── Public API ──────────────────────────────────────────────────

export async function fetchVendas(): Promise<RawVendaRow[]> {
    return fetchCsv<RawVendaRow>(SHEETS.vendas, true) as Promise<RawVendaRow[]>;
}

export async function fetchFacebook(): Promise<RawFacebookRow[]> {
    return fetchCsv<RawFacebookRow>(SHEETS.facebook, true) as Promise<RawFacebookRow[]>;
}

export async function fetchGeral(): Promise<string[][]> {
    return fetchCsv<string[]>(SHEETS.geral, false) as Promise<string[][]>;
}

// ─── Check connection ────────────────────────────────────────────

export async function checkConnection(): Promise<boolean> {
    try {
        const url = buildUrl(SHEETS.geral);
        const resp = await fetch(url, { method: "HEAD", next: { revalidate: 0 } });
        return resp.ok;
    } catch {
        return false;
    }
}
