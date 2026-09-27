import { useRef, useState } from "react";
import { Link } from "react-router";
import {
    ChevronDown,
    ClipboardCheck,
    LifeBuoy,
    Newspaper,
    Radio,
    Sparkles,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/session";
import AccountMenu from "@/components/AccountMenu";
import NotificationBell from "@/components/NotificationBell";

const featuresMenu = [
    {
        icon: ClipboardCheck,
        title: "Assessments",
        description: "Auto-graded skills tests & screening",
        href: "/features/assessments",
    },
    {
        icon: Radio,
        title: "Interviews",
        description: "Live & async technical interviews",
        href: "/features/interviews",
    },
];

const resourcesMenu = [
    {
        icon: Sparkles,
        title: "What's new",
        description: "Latest updates & releases",
        href: "/resources/whats-new",
    },
    {
        icon: LifeBuoy,
        title: "Help center",
        description: "Guides, FAQs, and support",
        href: "/resources/help-center",
    },
    {
        icon: Newspaper,
        title: "Blog",
        description: "Insights on assessments & hiring",
        href: "/resources/blog",
    },
    {
        icon: Star,
        title: "Customer reviews",
        description: "What our users say",
        href: "/resources/reviews",
    },
];

function NavDropdownItem({ item, onNavigate }) {
    const content = (
        <>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-colors duration-200 group-hover:bg-orange-500 group-hover:text-white">
                <item.icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
            </span>
            <div>
                <p className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-orange-600">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
        </>
    );

    if (item.href) {
        return (
            <Link
                to={item.href}
                onClick={onNavigate}
                className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-orange-50 focus-visible:bg-orange-50 focus-visible:outline-none dark:hover:bg-orange-500/10"
            >
                {content}
            </Link>
        );
    }

    return (
        <div className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-orange-50 cursor-default dark:hover:bg-orange-500/10">
            {content}
        </div>
    );
}

const navItemClass =
    "relative z-10 flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors duration-200 hover:text-orange-600 focus-visible:text-orange-600";

// Desktop nav with a pill that glides to whichever link is hovered or focused.
function PillNav({ children }) {
    const navRef = useRef(null);
    const [pill, setPill] = useState({ left: 0, width: 0, visible: false, instant: true });

    const moveTo = (target) => {
        const el = target.closest("[data-nav-item]");
        const nav = navRef.current;
        // Hovering inside an open dropdown keeps the pill on its trigger.
        if (!el || !nav) return;
        const navBox = nav.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        setPill((prev) => ({ left: box.left - navBox.left, width: box.width, visible: true, instant: !prev.visible }));
    };
    const hide = () => setPill((prev) => ({ ...prev, visible: false }));

    return (
        <nav
            ref={navRef}
            className="relative hidden items-center gap-1 md:flex"
            onMouseOver={(e) => moveTo(e.target)}
            onFocus={(e) => moveTo(e.target)}
            onMouseLeave={hide}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) hide();
            }}
        >
            <span
                aria-hidden="true"
                style={{ left: pill.left, width: pill.width }}
                className={cn(
                    "pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-orange-50 ring-1 ring-orange-500/20 dark:bg-orange-500/10",
                    pill.instant
                        ? "transition-opacity duration-200"
                        : "transition-[left,width,opacity] duration-[380ms] ease-[cubic-bezier(0.3,0.8,0.25,1)]",
                    pill.visible ? "opacity-100" : "opacity-0"
                )}
            />
            {children}
        </nav>
    );
}

function NavDropdown({ label, items }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                data-nav-item
                className={cn(navItemClass, open && "text-orange-600")}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                {label}
                <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
            </button>

            <div
                className={cn(
                    "absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition-[opacity,visibility] duration-200",
                    open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
                )}
            >
                <div
                    className={cn(
                        "origin-top rounded-xl bg-card p-2 shadow-lg ring-1 ring-foreground/10 transition-transform duration-200 ease-out",
                        open ? "translate-y-0 scale-100" : "-translate-y-1 scale-[0.98]"
                    )}
                >
                    {items.map((item) => (
                        <NavDropdownItem key={item.title} item={item} onNavigate={() => setOpen(false)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function AuthActions() {
    const { user, loading } = useSession();

    // Hold the slot while the session loads so the header doesn't flash "Log in".
    if (loading) return <span className="size-9" aria-hidden="true" />;
    if (user) {
        return (
            <>
                {user.role === "student" && (
                    // Bell sits a fixed 20px left of the account icon at every width.
                    <div className="flex flex-1 justify-end pr-5">
                        <NotificationBell />
                    </div>
                )}
                <AccountMenu />
            </>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
                Log in
            </Link>
            <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
            >
                Start free
            </Link>
        </div>
    );
}

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo and actions share the remaining width equally, keeping the nav centred. */}
                <div className="flex flex-1 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                            Q
                        </span>
                        <span className="font-heading text-lg font-black tracking-tight">Quizgate</span>
                    </Link>
                </div>

                <PillNav>
                    <NavDropdown label="Features" items={featuresMenu} />
                    <NavDropdown label="Resources" items={resourcesMenu} />
                    <a href="/#how-it-works" data-nav-item className={navItemClass}>
                        How it works
                    </a>
                    <a href="/#pricing" data-nav-item className={navItemClass}>
                        Pricing
                    </a>
                </PillNav>

                <div className="flex flex-1 items-center justify-end">
                    <AuthActions />
                </div>
            </div>
        </header>
    );
}
