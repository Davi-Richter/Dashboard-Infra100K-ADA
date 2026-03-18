import { NextResponse } from "next/server";
import { fetchVendas, fetchFacebook, fetchGeral, fetchAnalytics } from "@/lib/sheets";
import { processVendas, processFacebook, processGeral, processAnalytics } from "@/lib/processors";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";

    try {
        if (tab === "all") {
            const [rawVendas, rawFacebook, rawGeral, rawAnalytics] = await Promise.all([
                fetchVendas(),
                fetchFacebook(),
                fetchGeral(),
                fetchAnalytics().catch(() => []), // Gracefully fail if Analytics tab doesn't exist yet
            ]);

            return NextResponse.json({
                vendas: processVendas(rawVendas),
                facebook: processFacebook(rawFacebook),
                geral: processGeral(rawGeral),
                analytics: processAnalytics(rawAnalytics),
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
