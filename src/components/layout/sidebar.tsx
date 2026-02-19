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
        <aside className={`sidebar-glass h-screen flex flex-col overflow-y-auto transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[260px]"}`}>
            {/* Collapse Toggle */}
            <div className="absolute right-[-12px] top-6 z-50 hidden md:block">
                <button
                    onClick={onToggle}
                    className="bg-[#1e1e2d] border border-white/10 rounded-full p-1 hover:bg-[#2b2b3d] text-text-secondary transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Logo */}
            <div className={`px-4 pt-6 pb-4 flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                <LayoutDashboard size={28} className="text-accent shrink-0" />
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-[1.1rem] font-bold text-text-primary leading-tight truncate">Dashboard</h1>
                        <p className="text-[0.7rem] text-text-tertiary truncate">Acadêmia da aprovação</p>
                    </div>
                )}
            </div>

            {/* Separator */}
            <div className="mx-5 border-b border-white/[0.03]" />

            {/* Navigation */}
            <nav className="px-3 mt-4 space-y-1">
                {!isCollapsed && <div className="sidebar-section-label truncate">Navegação</div>}
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-item flex items-center ${isActive ? "sidebar-item-active" : ""} ${isCollapsed ? "justify-center px-0 py-3" : ""}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Status */}
            <div className={`px-4 space-y-3 ${isCollapsed ? "items-center flex flex-col" : ""}`}>
                {!isCollapsed ? (
                    <StatusBadge connected={connected} />
                ) : (
                    <div className={`w-3 h-3 rounded-full ${connected ? "bg-positive" : "bg-warning"}`} title={connected ? "Conectado" : "Desconectado"}></div>
                )}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`btn-glass flex items-center justify-center gap-2 ${isCollapsed ? "w-10 h-10 p-0 rounded-md" : "w-full"}`}
                    title="Atualizar Dados"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    {!isCollapsed && <span>Atualizar</span>}
                </button>
                {lastUpdated && !isCollapsed && (
                    <p className="text-[0.65rem] text-text-muted text-center truncate">
                        Atualizado: {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                )}
            </div>

            {/* Separator */}
            <div className="mx-4 my-4 border-b border-white/[0.06]" />

            {/* Filters */}
            {children && (
                <div className={`px-4 pb-6 flex-1 overflow-y-auto ${isCollapsed ? "hidden" : "block"}`}>
                    <div className="sidebar-section-label">Filtros</div>
                    {children}
                </div>
            )}
        </aside>
    );
}
