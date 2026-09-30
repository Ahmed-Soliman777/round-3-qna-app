import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { ArrowRight, Briefcase, CheckCircle2, GraduationCap, LifeBuoy, Mail, MessageCircle, Receipt } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InlineCta from "@/components/InlineCta";
import FeatureCard from "@/components/FeatureCard";
import Reveal from "@/components/Reveal";
import { useSession } from "@/context/session";
import { validateEmail, validateName } from "@/lib/authValidation";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "hello@quizgate.io";
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

const topics = [
    {
        id: "sales",
        icon: Briefcase,
        title: "Sales & demos",
        reply: "Reply in 1 business day",
        description: "Plans for bigger teams, SSO / SAML, SLAs, and a guided walkthrough of Quizgate for your organization.",
        placeholder: "Tell us about your team and what you'd like to run on Quizgate.",
    },
    {
        id: "support",
        icon: LifeBuoy,
        title: "Product support",
        reply: "Reply in 1 business day",
        description: "Something not working as expected? Tell us what you were doing and what happened instead.",
        placeholder: "What were you trying to do, and what happened?",
        note: "Students: quiz access, deadlines and retakes are set by your instructor, so they can help fastest.",
    },
    {
        id: "billing",
        icon: Receipt,
        title: "Billing",
        reply: "Reply in 2 business days",
        description: "Invoices, receipts, plan changes, and questions about what you're paying for.",
        placeholder: "Which plan are you on, and what do you need help with?",
    },
    {
        id: "other",
        icon: MessageCircle,
        title: "Something else",
        reply: "Reply in 2 business days",
        description: "Partnerships, press, feedback, or anything that doesn't fit the other topics.",
        placeholder: "What's on your mind?",
    },
];

const teamSizes = ["Just me", "2–10", "11–50", "51–200", "200+"];

const otherWays = [
    {
        icon: Mail,
        title: CONTACT_EMAIL,
        description: "Prefer your own inbox? Email us directly about anything. A real person reads every message.",
        href: `mailto:${CONTACT_EMAIL}`,
    },
    {
        icon: LifeBuoy,
        title: "Help center",
        description: "Guides and answers to the most common questions, open any time, no waiting for a reply.",
        to: "/resources/help-center",
    },
    {
        icon: GraduationCap,
        title: "Taking a quiz?",
        description: "Sign in to see every quiz you've been invited to. For access or deadlines, ask your instructor.",
        to: "/login",
    },
];

function validate(values, topic) {
    const errors = {};
    const name = validateName(values.name);
    const email = validateEmail(values.email);
    if (name) errors.name = name;
    if (email) errors.email = email;
    if (topic === "sales" && !values.organization.trim()) errors.organization = "Add your school or company.";
    const message = values.message.trim();
    if (!message) errors.message = "Write a short message.";
    else if (message.length < MESSAGE_MIN) errors.message = `Add a little more detail (at least ${MESSAGE_MIN} characters).`;
    return errors;
}

// The form is sent through the visitor's own email app, pre-filled, since there's no contact inbox API yet.
function buildMailto(values, topic) {
    const lines = [values.message.trim(), "", "—", `Name: ${values.name.trim()}`, `Email: ${values.email.trim()}`];
    if (values.organization.trim()) lines.push(`Organization: ${values.organization.trim()}`);
    if (topic.id === "sales" && values.teamSize) lines.push(`Team size: ${values.teamSize}`);
    const subject = `[Quizgate · ${topic.title}] ${values.name.trim()}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const fieldClass = (error) =>
    cn(
        "w-full rounded-xl bg-background px-4 py-3 text-sm ring-1 outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2",
        error ? "ring-destructive focus:ring-destructive" : "ring-border focus:ring-brand",
    );

function Field({ id, label, optional, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium">
                {label}
                {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function ContactPage() {
    const { user } = useSession();
    const { state } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const topic = topics.find((t) => t.id === searchParams.get("topic")) ?? topics[0];
    const [values, setValues] = useState({
        name: user?.name ?? "",
        // The home page's "Contact" door passes along the email typed there.
        email: user?.email ?? state?.email ?? "",
        organization: "",
        teamSize: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);
    const [sent, setSent] = useState(false);

    const selectTopic = (id) => {
        setSearchParams({ topic: id }, { replace: true, preventScrollReset: true });
        if (touched) setErrors(validate(values, id));
    };

    const update = (field) => (event) => {
        const next = { ...values, [field]: event.target.value };
        setValues(next);
        if (touched) setErrors(validate(next, topic.id));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setTouched(true);
        const found = validate(values, topic.id);
        setErrors(found);
        if (Object.keys(found).length) {
            document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
            return;
        }
        window.location.assign(buildMailto(values, topic));
        setSent(true);
    };

    const describedBy = (field) => (errors[field] ? `contact-${field}-error` : undefined);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SiteHeader />

            <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ← Back to home
                </Link>

                <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">Contact</h1>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                    Questions about plans, a problem with a quiz, or just want to see Quizgate in action? Pick a
                    topic and we'll get your message to the right person.
                </p>

                <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    What can we help with?
                </p>
                <Reveal className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <div role="tablist" aria-label="Contact topics" className="flex flex-col gap-2">
                        {topics.map((t) => {
                            const active = t.id === topic.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-controls="contact-panel"
                                    onClick={() => selectTopic(t.id)}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-300",
                                        active
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "bg-muted hover:translate-x-1 hover:bg-muted/70",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                                            active ? "bg-brand text-brand-foreground" : "bg-brand-soft text-brand",
                                        )}
                                    >
                                        <t.icon className="size-4" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block font-bold tracking-tight">{t.title}</span>
                                        <span
                                            className={cn(
                                                "block text-xs",
                                                active ? "text-primary-foreground/70" : "text-muted-foreground",
                                            )}
                                        >
                                            {t.reply}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        key={sent ? "sent" : topic.id}
                        id="contact-panel"
                        role="tabpanel"
                        className="rounded-2xl bg-muted p-6 ring-1 ring-brand/25 animate-in fade-in slide-in-from-right-4 duration-300 sm:p-8"
                    >
                        {sent ? (
                            <div className="flex h-full flex-col items-start justify-center py-6">
                                <CheckCircle2 className="size-10 text-green-600" />
                                <h2 className="mt-4 text-3xl font-black tracking-tight">Almost there</h2>
                                <p className="mt-3 max-w-md text-muted-foreground">
                                    Your email app should have opened with everything filled in. Hit send there and
                                    we'll reply to <span className="font-semibold text-foreground">{values.email.trim()}</span>.
                                </p>
                                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                                    Nothing opened? Email us at{" "}
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:underline">
                                        {CONTACT_EMAIL}
                                    </a>
                                    .
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSent(false)}
                                    className="mt-6 rounded-full bg-background px-5 py-2.5 text-sm font-semibold ring-1 ring-border transition-colors hover:bg-muted"
                                >
                                    Edit my message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                                    {topic.reply}
                                </span>
                                <h2 className="mt-4 text-3xl font-black tracking-tight">{topic.title}</h2>
                                <p className="mt-2 text-muted-foreground">{topic.description}</p>
                                {topic.note && (
                                    <p className="mt-4 flex gap-2 rounded-xl bg-student-soft px-4 py-3 text-sm text-student">
                                        <GraduationCap className="mt-0.5 size-4 shrink-0" />
                                        {topic.note}
                                    </p>
                                )}

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <Field id="contact-name" label="Full name" error={errors.name}>
                                        <input
                                            id="contact-name"
                                            autoComplete="name"
                                            value={values.name}
                                            onChange={update("name")}
                                            placeholder="Alex Morgan"
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={describedBy("name")}
                                            className={fieldClass(errors.name)}
                                        />
                                    </Field>
                                    <Field id="contact-email" label="Email" error={errors.email}>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            autoComplete="email"
                                            value={values.email}
                                            onChange={update("email")}
                                            placeholder="you@school.edu"
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={describedBy("email")}
                                            className={fieldClass(errors.email)}
                                        />
                                    </Field>
                                    <Field
                                        id="contact-organization"
                                        label="School or company"
                                        optional={topic.id !== "sales"}
                                        error={errors.organization}
                                    >
                                        <input
                                            id="contact-organization"
                                            autoComplete="organization"
                                            value={values.organization}
                                            onChange={update("organization")}
                                            placeholder="Northfield Academy"
                                            aria-invalid={Boolean(errors.organization)}
                                            aria-describedby={describedBy("organization")}
                                            className={fieldClass(errors.organization)}
                                        />
                                    </Field>
                                    {topic.id === "sales" && (
                                        <Field id="contact-teamSize" label="Team size" optional>
                                            <select
                                                id="contact-teamSize"
                                                value={values.teamSize}
                                                onChange={update("teamSize")}
                                                className={cn(fieldClass(), "appearance-none")}
                                            >
                                                <option value="">Choose one</option>
                                                {teamSizes.map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    )}
                                    <div className="sm:col-span-2">
                                        <Field id="contact-message" label="Message" error={errors.message}>
                                            <textarea
                                                id="contact-message"
                                                rows={5}
                                                maxLength={MESSAGE_MAX}
                                                value={values.message}
                                                onChange={update("message")}
                                                placeholder={topic.placeholder}
                                                aria-invalid={Boolean(errors.message)}
                                                aria-describedby={describedBy("message")}
                                                className={cn(fieldClass(errors.message), "resize-y")}
                                            />
                                        </Field>
                                        <p className="mt-1 text-right text-xs text-muted-foreground">
                                            {values.message.length} / {MESSAGE_MAX}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-xs text-muted-foreground">
                                        Opens your email app with your message ready to send.
                                    </p>
                                    <button
                                        type="submit"
                                        className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                                    >
                                        Send message
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </Reveal>

                <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Other ways to reach us
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {otherWays.map((way, i) => {
                        const card = <FeatureCard icon={way.icon} title={way.title} description={way.description} delay={i * 100} />;
                        return way.to ? (
                            <Link key={way.title} to={way.to} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                                {card}
                            </Link>
                        ) : (
                            <a key={way.title} href={way.href} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                                {card}
                            </a>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <InlineCta title="Rather see it for yourself?" subtitle="One admin seat free. No credit card required." />
                </div>
            </div>

            <SiteFooter />
        </main>
    );
}
