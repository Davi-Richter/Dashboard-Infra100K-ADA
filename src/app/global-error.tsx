"use client";

import { useEffect } from "react";
import "./globals.css"; // Ensure CSS loads to style the error page

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Critical Global Error:", error);
    }, [error]);

    return (
        <html>
            <body className="bg-[#050507] text-white">
                <div className="flex h-screen items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full p-8 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Erro Crítico</h2>
                        <p className="text-white/60 mb-6 break-words font-mono bg-black/30 p-4 rounded text-sm">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-white/30 mb-6 font-mono">
                                Digest ID: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={() => reset()}
                            className="btn-accent px-6 py-2 rounded-lg"
                        >
                            Recarregar Aplicação
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
