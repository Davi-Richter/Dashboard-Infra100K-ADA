"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global app error:", error);
    }, [error]);

    return (
        <div className="flex h-screen items-center justify-center bg-[#050507] text-white p-4">
            <div className="glass-card max-w-md w-full p-8 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Algo deu errado!</h2>
                <p className="text-white/60 text-sm mb-6 font-mono break-words bg-black/30 p-3 rounded">
                    {error.message || "Erro desconhecido"}
                    {error.digest && (
                        <span className="block mt-2 text-xs opacity-50">
                            Digest: {error.digest}
                        </span>
                    )}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
