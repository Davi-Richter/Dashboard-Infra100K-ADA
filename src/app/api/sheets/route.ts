import { NextResponse } from "next/server";
import { fetchVendas, fetchFacebook, fetchGeral } from "@/lib/sheets";
import { processVendas, processFacebook, processGeral } from "@/lib/processors";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";

    try {
        if (tab === "all") {
            const [rawVendas, rawFacebook, rawGeral] = await Promise.all([
                fetchVendas(),
                fetchFacebook(),
                fetchGeral(),
            ]);

            return NextResponse.json({
                vendas: processVendas(rawVendas),
                facebook: processFacebook(rawFacebook),
                geral: processGeral(rawGeral),
            });
        }

        if (tab === "vendas") {
            const raw = await fetchVendas();
            return NextResponse.json(processVendas(raw));
        }

        if (tab === "facebook") {
            const raw = await fetchFacebook();
            return NextResponse.json(processFacebook(raw));
        }

        if (tab === "geral") {
            const raw = await fetchGeral();
            return NextResponse.json(processGeral(raw));
        }

        return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
    } catch (error) {
        console.error("API /sheets error:", error);
        return NextResponse.json(
            { error: "Failed to fetch data", vendas: [], facebook: [], geral: [] },
            { status: 500 }
        );
    }
}
