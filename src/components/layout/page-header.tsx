interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="gradient-text">{title}</h1>
            <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>
    );
}
