import { cn } from "@/lib/utils";

// Single-select pill group. `options` is a list of strings or { value, label, count }.
export default function FilterChips({ options, value, onChange, label = "Filter", className }) {
    return (
        <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
            {options.map((option) => {
                const opt = typeof option === "string" ? { value: option, label: option } : option;
                const active = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all",
                            active
                                ? "bg-primary text-primary-foreground ring-primary"
                                : "bg-background text-muted-foreground ring-border hover:text-foreground hover:ring-orange-400",
                        )}
                    >
                        {opt.label}
                        {opt.count !== undefined && (
                            <span className={cn("ml-1.5 text-xs", active ? "opacity-70" : "opacity-60")}>
                                {opt.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
