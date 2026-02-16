"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectFilterProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = (val: string) => {
        if (selected.includes(val)) {
            onChange(selected.filter((s) => s !== val));
        } else {
            onChange([...selected, val]);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <label className="text-[0.7rem] text-text-tertiary uppercase tracking-wider block mb-1">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="input-glass flex items-center justify-between gap-2 text-left"
            >
                <span className="truncate text-text-secondary text-sm">
                    {selected.length === 0 ? "Todos" : `${selected.length} selecionado(s)`}
                </span>
                <ChevronDown size={14} className="text-text-tertiary shrink-0" />
            </button>

            {selected.length > 0 && (
                <button
                    onClick={() => onChange([])}
                    className="absolute top-0 right-0 text-text-tertiary hover:text-text-primary transition-colors"
                >
                    <X size={12} />
                </button>
            )}

            {open && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto glass-card-sm !p-2 space-y-0.5">
                    {options.map((opt) => (
                        <label
                            key={opt}
                            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-white/[0.04] rounded-md transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                onChange={() => toggle(opt)}
                                className="accent-accent"
                            />
                            <span className="text-sm text-text-secondary truncate">{opt}</span>
                        </label>
                    ))}
                    {options.length === 0 && (
                        <p className="text-xs text-text-tertiary px-2 py-1">Sem opções</p>
                    )}
                </div>
            )}
        </div>
    );
}
