import { Link } from "react-router";
import { ArrowRight, Mail } from "lucide-react";

// Only pages that exist. `href` is for hash links on the home page, `to` for routes.
const footerColumns = [
    {
        title: "Product",
        links: [
            { label: "Assessments", to: "/features/assessments" },
            { label: "How it works", href: "/#how-it-works" },
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
            { label: "Contact us", to: "/contact" },
        ],
    },
];

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

// Dark footer shared by every marketing page: the brand and real links only.
export default function SiteFooter() {
    return (
        <footer className="bg-neutral-950 text-neutral-400 dark:border-t dark:border-border dark:bg-card">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
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
        </footer>
    );
}
