import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
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
    },
];

export default function Pricing() {
    const [billing, setBilling] = useState("monthly");

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

                <div className="mt-8 grid gap-6 text-left lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <Reveal key={plan.name} delay={i * 100}>
                            {/* The featured plan has a glowing runner lapping its edge. */}
                            <div
                                className={cn(
                                    "h-full rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl",
                                    plan.highlighted && "relative p-[2px]"
                                )}
                            >
                                {plan.highlighted && <RunnerBorder />}
                                <div
                                    className={cn(
                                        "relative flex h-full flex-col p-8",
                                        plan.highlighted
                                            ? "rounded-[calc(1rem-2px)] bg-primary text-primary-foreground"
                                            : "rounded-2xl bg-card ring-1 ring-foreground/10"
                                    )}
                                >
                                    <p
                                        className={cn(
                                            "text-xs font-semibold uppercase tracking-wide",
                                            plan.highlighted ? "text-orange-400" : "text-muted-foreground"
                                        )}
                                    >
                                        {plan.name}
                                    </p>
                                    <p className="mt-3 text-4xl font-black tabular-nums">
                                        <span key={billing} className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-300">
                                            {plan.price ? `$${plan.price[billing]}` : "Custom"}
                                        </span>
                                        <span
                                            className={cn(
                                                "ml-1 text-base font-medium",
                                                plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"
                                            )}
                                        >
                                            {plan.period}
                                        </span>
                                    </p>
                                    <p
                                        className={cn(
                                            "mt-3 text-sm",
                                            plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                                        )}
                                    >
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
                                        to="/register"
                                        className={cn(
                                            "mt-8 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                                            plan.highlighted
                                                ? "bg-white text-primary hover:bg-white/90"
                                                : "bg-primary text-primary-foreground hover:bg-primary/85"
                                        )}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}