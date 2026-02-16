"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    LayoutGrid,
    Target,
    Palette,
    Users,
    DollarSign,
    RefreshCw,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const NAV_ITEMS = [
    { label: "Visão Executiva", href: "/visao-executiva", icon: LayoutGrid },
    { label: "Campanhas", href: "/campanhas", icon: Target },
    { label: "Criativos", href: "/criativos", icon: Palette },
    { label: "Clientes", href: "/clientes", icon: Users },
    { label: "Financeiro", href: "/financeiro", icon: DollarSign },
];

interface SidebarProps {
    connected: boolean;
    lastUpdated: Date | null;
    onRefresh: () => void;
    loading: boolean;
    children?: React.ReactNode;
}

export function Sidebar({ connected, lastUpdated, onRefresh, loading, children }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="sidebar-glass w-[260px] h-screen fixed left-0 top-0 z-40 flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="px-5 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <LayoutDashboard size={28} className="text-accent" />
                    <div>
                        <h1 className="text-[1.3rem] font-bold text-text-primary leading-tight">Dashboard</h1>
                        <p className="text-[0.8rem] text-text-tertiary">Marketing & Vendas</p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="mx-4 border-b border-white/[0.06]" />

            {/* Navigation */}
            <nav className="px-3 mt-4 space-y-1">
                <div className="sidebar-section-label">Navegação</div>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Status */}
            <div className="px-4 space-y-3">
                <StatusBadge connected={connected} />
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="btn-glass w-full flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Atualizar Dados
                </button>
                {lastUpdated && (
                    <p className="text-[0.72rem] text-text-muted text-center">
                        Última atualização:{" "}
                        {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                )}
            </div>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Filters */}
            {children && (
                <div className="px-4 pb-6 flex-1 overflow-y-auto">
                    <div className="sidebar-section-label">Filtros</div>
                    {children}
                </div>
            )}
        </aside>
    );
}
