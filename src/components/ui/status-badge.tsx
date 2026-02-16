interface StatusBadgeProps {
    connected: boolean;
}

export function StatusBadge({ connected }: StatusBadgeProps) {
    return connected ? (
        <span className="status-online">● Conectado</span>
    ) : (
        <span className="status-offline">● Offline</span>
    );
}
