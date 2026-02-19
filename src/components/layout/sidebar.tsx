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
    ChevronLeft,
    ChevronRight,
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
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ connected, lastUpdated, onRefresh, loading, children, isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`sidebar-glass h-screen flex flex-col overflow-y-auto transition-all duration-300 w-[260px] ${isCollapsed ? "md:w-[80px]" : ""}`}>
            {/* Logo */}
            <div className={`px-4 pt-6 pb-4 flex items-center gap-3 ${isCollapsed ? "md:justify-center" : ""}`}>
                <LayoutDashboard size={28} className="text-accent shrink-0" />
                <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "md:hidden" : ""}`}>
                    <h1 className="text-[1.1rem] font-bold text-text-primary leading-tight truncate">Dashboard</h1>
                    <p className="text-[0.7rem] text-text-tertiary truncate">Acadêmia da aprovação</p>
                </div>
            </div>

            {/* Separator */}
            <div className="mx-5 border-b border-white/[0.03]" />

            {/* Navigation */}
            <nav className="px-3 mt-4 space-y-1">
                <div className={`sidebar-section-label truncate ${isCollapsed ? "md:hidden" : ""}`}>Navegação</div>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-item flex items-center ${isActive ? "sidebar-item-active" : ""} ${isCollapsed ? "md:justify-center md:px-0 md:py-3" : ""}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span className={`truncate ${isCollapsed ? "md:hidden" : ""}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Status */}
            <div className={`px-4 space-y-3 ${isCollapsed ? "md:items-center md:flex md:flex-col" : ""}`}>
                <div className={isCollapsed ? "md:hidden" : ""}>
                    <StatusBadge connected={connected} />
                </div>
                {isCollapsed && (
                    <div className={`hidden md:block w-3 h-3 rounded-full ${connected ? "bg-positive" : "bg-warning"}`} title={connected ? "Conectado" : "Desconectado"}></div>
                )}

                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`btn-glass flex items-center justify-center gap-2 ${isCollapsed ? "md:w-10 md:h-10 md:p-0 md:rounded-md" : "w-full"}`}
                    title="Atualizar Dados"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span className={isCollapsed ? "md:hidden" : ""}>Atualizar</span>
                </button>
                {lastUpdated && (
                    <p className={`text-[0.65rem] text-text-muted text-center truncate ${isCollapsed ? "md:hidden" : ""}`}>
                        Atualizado: {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                )}
            </div>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Filters */}
            {children && (
                <div className={`px-4 pb-6 flex-1 overflow-y-auto ${isCollapsed ? "md:hidden" : ""}`}>
                    <div className="sidebar-section-label">Filtros</div>
                    {children}
                </div>
            )}
        </aside>
    );
}
