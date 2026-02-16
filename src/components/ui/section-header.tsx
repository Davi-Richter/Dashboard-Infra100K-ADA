interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <div className="mb-4 mt-2">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                {title}
            </h3>
            {subtitle && <p className="text-sm text-text-tertiary mt-1">{subtitle}</p>}
        </div>
    );
}
