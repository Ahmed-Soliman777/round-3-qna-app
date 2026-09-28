import { Link } from "react-router";
import { ArrowRight, ArrowUp, Mail } from "lucide-react";
import { useRoleActions } from "@/hooks/useRoleActions";
import { cn } from "@/lib/utils";

// Only pages that exist. `href` is for hash links on the home page, `to` for routes.
const footerColumns = [
    {
        title: "Product",
        links: [
            { label: "Assessments", to: "/features/assessments" },
            { label: "Interviews", to: "/features/interviews" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Pricing", href: "/#pricing" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "What's new", to: "/resources/whats-new" },
            { label: "Help center", to: "/resources/help-center" },
            { label: "Blog", to: "/resources/blog" },
            { label: "Customer reviews", to: "/resources/reviews" },
        ],
    },
    {
        title: "Get started",
        links: [
            { label: "Create an account", to: "/register" },
            { label: "Log in", to: "/login" },
            { label: "Contact us", href: "mailto:hello@quizgate.io" },
        ],
    },
];

const primaryTone = {
    brand: "bg-brand text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand-hover",
    student: "bg-student text-student-foreground shadow-lg shadow-student/30 hover:opacity-90",
};

const linkClass =
    "group inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none";

function FooterLink({ link }) {
    const content = (
        <>
            {link.label}
            <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </>
    );
    return link.to ? (
        <Link to={link.to} className={linkClass}>
            {content}
        </Link>
    ) : (
        <a href={link.href} className={linkClass}>
            {content}
        </a>
    );
}

// Dark closing band shared by every marketing page: a last call to action, real links, and the brand.
export default function SiteFooter() {
    const { primary, secondary } = useRoleActions();

    return (
        <footer className="relative isolate overflow-hidden bg-neutral-950 text-neutral-400 dark:border-t dark:border-border dark:bg-card">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Closing call to action */}
                <div className="flex flex-col gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Ready when you are</p>
                        <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Your next quiz opens on schedule.
                        </h2>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Link
                            to={primary.to}
                            state={primary.state}
                            className={cn(
                                "group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
                                primaryTone[primary.tone],
                            )}
                        >
                            {primary.label}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        {secondary && (
                            <Link
                                to={secondary.to}
                                className="flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/10"
                            >
                                <secondary.icon className="size-4 text-student" />
                                {secondary.label}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Brand and links */}
                <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="max-w-xs">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-neutral-950">
                                Q
                            </span>
                            <span className="font-heading text-lg font-black tracking-tight text-white">Quizgate</span>
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed">
                            Scheduled, role-gated assessments. Admins publish, and every student takes it on time.
                        </p>
                        <a
                            href="mailto:hello@quizgate.io"
                            className="mt-5 inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
                        >
                            <Mail className="size-4 text-brand" />
                            hello@quizgate.io
                        </a>
                    </div>

                    {footerColumns.map((col) => (
                        <nav key={col.title} aria-label={col.title}>
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{col.title}</p>
                            <ul className="mt-4 space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink link={link} />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="flex flex-col-reverse items-start gap-4 border-t border-white/10 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Quizgate. All rights reserved.</p>
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-neutral-400 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/25"
                    >
                        Back to top
                        <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
                    </button>
                </div>
            </div>

            {/* Oversized wordmark, purely decorative. */}
            <p
                aria-hidden="true"
                className="pointer-events-none -mt-4 -mb-[0.22em] select-none text-center font-heading text-[19vw] font-black leading-none tracking-tighter text-white/[0.04]"
            >
                Quizgate
            </p>
        </footer>
    );
}
