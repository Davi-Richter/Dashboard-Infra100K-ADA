"use client";

interface DateRangePickerProps {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
    return (
        <div className="space-y-2">
            <div>
                <label className="text-[0.7rem] text-text-tertiary uppercase tracking-wider block mb-1">De</label>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onChange(e.target.value, to)}
                    className="input-glass text-sm"
                    style={{ colorScheme: "dark" }}
                />
            </div>
            <div>
                <label className="text-[0.7rem] text-text-tertiary uppercase tracking-wider block mb-1">Até</label>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onChange(from, e.target.value)}
                    className="input-glass text-sm"
                    style={{ colorScheme: "dark" }}
                />
            </div>
        </div>
    );
}
