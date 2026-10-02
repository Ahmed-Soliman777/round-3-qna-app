import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
    ChevronDown,
    ClipboardCheck,
    Menu,
    X,
    LifeBuoy,
    Newspaper,
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
    "relative z-10 flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors duration-200 hover:text-orange-600 focus-visible:text-orange-600";

// Desktop nav with a pill that glides to whichever link is hovered or focused.
// It uses the same orange hover as the dropdown items so the whole menu reads as one surface.
function PillNav({ children }) {
    const navRef = useRef(null);
    const activeRef = useRef(null);
    const [pill, setPill] = useState({ x: 0, width: 0, visible: false, instant: true });

    const measure = useCallback((el, instant) => {
        const nav = navRef.current;
        if (!el || !nav) return;
        const navBox = nav.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        setPill({ x: box.left - navBox.left, width: box.width, visible: true, instant });
    }, []);

    const moveTo = (target) => {
        const el = target.closest("[data-nav-item]");
        // Hovering inside an open dropdown keeps the pill on its trigger.
        if (!el || el === activeRef.current) return;
        // Appear in place when coming from outside; glide when moving between items.
        const appearing = !activeRef.current;
        activeRef.current = el;
        measure(el, appearing);
    };
    const hide = () => {
        activeRef.current = null;
        setPill((prev) => ({ ...prev, visible: false }));
    };

    // Keep the pill glued to its item when the layout shifts (resize, font load).
    useEffect(() => {
        const nav = navRef.current;
        if (!nav || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => {
            if (activeRef.current) measure(activeRef.current, true);
        });
        observer.observe(nav);
        return () => observer.disconnect();
    }, [measure]);

    return (
        <nav
            ref={navRef}
            className="relative hidden items-center gap-1 lg:flex"
            onMouseOver={(e) => moveTo(e.target)}
            onFocus={(e) => moveTo(e.target)}
            onMouseLeave={hide}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) hide();
            }}
        >
            <span
                aria-hidden="true"
                style={{ transform: `translateX(${pill.x}px)`, width: pill.width }}
                className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 my-auto h-8 rounded-full bg-orange-50 will-change-[transform,width] motion-reduce:transition-none dark:bg-orange-500/10",
                    pill.instant
                        ? "transition-opacity duration-150"
                        : "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
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
                className="hidden text-sm font-medium text-foreground hover:text-muted-foreground transition-colors sm:inline"
            >
                Log in
            </Link>
            <Link
                to="/register"
                className="shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
            >
                Start free
            </Link>
        </div>
    );
}

const mobileLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Contact", to: "/contact" },
];

// Below lg the full nav doesn't fit (especially with large text), so the same links live in a panel.
function MobileNav() {
    const { user } = useSession();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [openedOn, setOpenedOn] = useState(pathname);
    const ref = useRef(null);

    // Close whenever the page changes.
    if (open && openedOn !== pathname) setOpen(false);

    useEffect(() => {
        if (!open) return;
        const onPointer = (event) => {
            if (!ref.current?.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => event.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const close = () => setOpen(false);
    const linkClass =
        "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10";

    return (
        <div ref={ref} className="ml-3 lg:hidden">
            <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => {
                    setOpenedOn(pathname);
                    setOpen((value) => !value);
                }}
                className="flex size-9 items-center justify-center rounded-full text-foreground ring-1 ring-border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            <div
                id="mobile-nav"
                className={cn(
                    "absolute inset-x-0 top-full border-b border-border bg-background shadow-lg transition-[opacity,translate,visibility] duration-200 ease-out",
                    open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-2 opacity-0"
                )}
            >
                <div className="mx-auto max-h-[calc(100dvh-4rem)] max-w-7xl overflow-y-auto px-6 py-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            ["Features", featuresMenu],
                            ["Resources", resourcesMenu],
                        ].map(([title, items]) => (
                            <div key={title}>
                                <p className="px-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
                                <div className="mt-2">
                                    {items.map((item) => (
                                        <NavDropdownItem key={item.title} item={item} onNavigate={close} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-col border-t border-border pt-4 sm:flex-row sm:gap-2">
                        {mobileLinks.map((link) =>
                            link.to ? (
                                <Link key={link.label} to={link.to} onClick={close} className={linkClass}>
                                    {link.label}
                                </Link>
                            ) : (
                                <a key={link.label} href={link.href} onClick={close} className={linkClass}>
                                    {link.label}
                                </a>
                            )
                        )}
                    </div>
                    {!user && (
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:hidden">
                            <Link
                                to="/login"
                                onClick={close}
                                className="rounded-full py-2.5 text-center text-sm font-semibold ring-1 ring-border transition-colors hover:bg-muted"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                onClick={close}
                                className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                            >
                                Start free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6 lg:px-8">
                {/* Logo and actions share the remaining width equally, keeping the nav centred. */}
                <div className="flex flex-1 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                            Q
                        </span>
                        <span className="font-heading text-lg font-black tracking-tight whitespace-nowrap">Quizgate</span>
                    </Link>
                </div>

                <PillNav>
                    <NavDropdown label="Features" items={featuresMenu} />
                    <NavDropdown label="Resources" items={resourcesMenu} />
                    <a href="/#how-it-works" data-nav-item className={navItemClass}>
                        How it works
                    </a>
                    <Link to="/contact" data-nav-item className={navItemClass}>
                        Contact
                    </Link>
                </PillNav>

                <div className="flex flex-1 items-center justify-end">
                    <AuthActions />
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
