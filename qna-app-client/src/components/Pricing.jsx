import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import RunnerBorder from "@/components/RunnerBorder";

const plans = [
    {
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        period: "/forever",
        description: "One admin seat, unlimited students, unlimited attempts.",
        features: [
            "1 admin seat",
            "Unlimited students",
            "Unlimited quiz attempts",
            "Scheduled windows",
            "Role-gated access",
        ],
        highlighted: false,
        cta: "Start free",
    },
    {
        name: "Team",
        price: { monthly: 29, yearly: 23 },
        period: "/per month",
        description: "For institutions running multiple assessments at once.",
        features: [
            "5 admin seats",
            "Everything in Free",
            "Analytics dashboard",
            "CSV exports",
            "Priority support",
        ],
        highlighted: true,
        cta: "Start free",
    },
    {
        name: "Enterprise",
        price: null,
        period: "contact us",
        description: "For large orgs with compliance and SSO requirements.",
        features: [
            "Unlimited admins",
            "Everything in Team",
            "SSO / SAML",
            "SLA guarantee",
        ],
        highlighted: false,
        cta: "Contact sales",
        ctaTo: "/contact?topic=sales",
    },
];

const MAX_TILT = 5;

// One plan. Every card tilts toward the pointer, lights up with an orange ring and a glow that
// follows it, and the other plans step back. Only the featured plan has the runner border and
// animates its price when billing changes.
function PlanCard({ plan, billing, mode, onEnter, onLeave }) {
    const [pointer, setPointer] = useState({ rx: 0, ry: 0, mx: "50%", my: "0%" });
    const featured = plan.highlighted;

    const handleMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        setPointer({ rx: y * -MAX_TILT, ry: x * MAX_TILT, mx: `${e.clientX - box.left}px`, my: `${e.clientY - box.top}px` });
    };

    return (
        <div
            data-state={mode}
            onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
            onPointerLeave={(e) => {
                setPointer((p) => ({ ...p, rx: 0, ry: 0 }));
                if (e.pointerType === "mouse") onLeave();
            }}
            onPointerMove={handleMove}
            onFocus={onEnter}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) onLeave();
            }}
            style={{ transform: `perspective(1000px) rotateX(${pointer.rx}deg) rotateY(${pointer.ry}deg)` }}
            className={cn(
                "group/plan relative h-full rounded-2xl active:scale-[0.99] motion-reduce:transform-none",
                "transition-[transform,translate,scale,opacity,filter,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                featured && "p-[2px]",
                mode === "active" && "-translate-y-1.5 shadow-2xl motion-reduce:translate-y-0",
                mode === "active" && (featured ? "shadow-brand/30" : "shadow-brand/15"),
                mode === "dimmed" && "scale-[0.98] opacity-80 saturate-75 motion-reduce:scale-100"
            )}
        >
            {featured && <RunnerBorder />}
            <div
                className={cn(
                    "relative isolate flex h-full flex-col overflow-hidden p-8",
                    featured
                        ? "rounded-[calc(1rem-2px)] bg-primary text-primary-foreground"
                        : "rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow duration-300 group-data-[state=active]/plan:ring-2 group-data-[state=active]/plan:ring-brand/40"
                )}
            >
                <span
                    aria-hidden="true"
                    style={{
                        background: `radial-gradient(380px circle at ${pointer.mx} ${pointer.my}, color-mix(in oklch, var(--brand) ${featured ? 24 : 12}%, transparent), transparent 65%)`,
                    }}
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-data-[state=active]/plan:opacity-100"
                />
                <p
                    className={cn(
                        "text-xs font-semibold uppercase tracking-wide transition-colors duration-300",
                        featured ? "text-orange-400" : "text-muted-foreground group-data-[state=active]/plan:text-brand"
                    )}
                >
                    {plan.name}
                </p>
                <p className="mt-3 text-4xl font-black tabular-nums">
                    <span
                        key={featured ? billing : undefined}
                        className={cn("inline-block", featured && "animate-in fade-in slide-in-from-bottom-1 duration-300")}
                    >
                        {plan.price ? `$${plan.price[billing]}` : "Custom"}
                    </span>
                    <span
                        className={cn(
                            "ml-1 text-base font-medium",
                            featured ? "text-primary-foreground/60" : "text-muted-foreground"
                        )}
                    >
                        {plan.period}
                    </span>
                </p>
                <p className={cn("mt-3 text-sm", featured ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {plan.description}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                            <Check className="size-4 shrink-0 text-green-500" />
                            {f}
                        </li>
                    ))}
                </ul>

                <Link
                    to={plan.ctaTo ?? "/register"}
                    className={cn(
                        "group/cta mt-8 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                        featured
                            ? "bg-white text-primary hover:bg-white/90"
                            : "bg-primary text-primary-foreground hover:bg-primary/85"
                    )}
                >
                    {plan.cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-data-[state=active]/plan:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

export default function Pricing() {
    const [billing, setBilling] = useState("monthly");
    const [active, setActive] = useState(null);

    return (
        <section id="pricing" className="py-12">
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                    Pricing
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                    Simple, honest pricing.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                    One admin seat free, forever. Pay only when your team grows.
                </p>

                <div
                    role="radiogroup"
                    aria-label="Billing period"
                    className="mt-6 inline-flex rounded-full bg-muted p-1 ring-1 ring-border"
                >
                    {["monthly", "yearly"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={billing === option}
                            onClick={() => setBilling(option)}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all",
                                billing === option
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {option}
                            {option === "yearly" && (
                                <span className="ml-1.5 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                                    −20%
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Stacked at a readable width on small screens, three across from lg. */}
                <div className="mx-auto mt-8 grid max-w-lg gap-6 text-left lg:max-w-none lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <Reveal key={plan.name} delay={i * 100} className="h-full">
                            <PlanCard
                                plan={plan}
                                billing={billing}
                                mode={active === null ? "idle" : active === plan.name ? "active" : "dimmed"}
                                onEnter={() => setActive(plan.name)}
                                onLeave={() => setActive(null)}
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}