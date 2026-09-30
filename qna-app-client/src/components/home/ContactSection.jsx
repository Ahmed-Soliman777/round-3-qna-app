import { Link } from "react-router";
import { ArrowRight, GraduationCap, Mail } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useSession } from "@/context/session";
import { CONTACT_EMAIL, contactTopics } from "@/lib/contactTopics";
import { cn } from "@/lib/utils";

const tones = {
    brand: "bg-brand-soft text-brand group-hover:bg-brand group-hover:text-brand-foreground",
    student: "bg-student-soft text-student group-hover:bg-student group-hover:text-student-foreground",
};

function TopicRow({ to, icon: Icon, title, hint, tone = "brand" }) {
    return (
        <Link
            to={to}
            className="group flex items-center gap-4 rounded-xl bg-muted px-5 py-4 outline-none transition-all duration-300 hover:translate-x-1 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-brand motion-reduce:hover:translate-x-0"
        >
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors", tones[tone])}>
                <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-bold tracking-tight">{title}</span>
                <span className="block text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
                    {hint}
                </span>
            </span>
            <ArrowRight className="size-4 shrink-0 opacity-40 transition-[translate,opacity] duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>
    );
}

// A short way in to the Contact page, where Pricing used to be. The full form lives on /contact.
export default function ContactSection() {
    const { user } = useSession();
    const role = user?.role ?? "guest";
    const topics = contactTopics.filter((t) => t.id === "sales" || t.id === "support");

    return (
        <section id="contact" className="border-t border-border py-16">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                <Reveal>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand">Contact</p>
                    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Talk to a real person.</h2>
                    <p className="mt-4 max-w-md text-lg text-muted-foreground">
                        Want to run Quizgate at your school, or stuck on something? Pick a topic and we'll get your
                        message to the right person.
                    </p>
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="group mt-8 inline-flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ring-border outline-none transition-shadow hover:ring-brand/50 focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                            <Mail className="size-4" />
                        </span>
                        <span>
                            <span className="block text-xs text-muted-foreground">Prefer your own inbox?</span>
                            <span className="block font-semibold">{CONTACT_EMAIL}</span>
                        </span>
                    </a>
                </Reveal>

                <Reveal delay={120} className="flex flex-col gap-2">
                    {topics.map((t) => (
                        <TopicRow key={t.id} to={`/contact?topic=${t.id}`} icon={t.icon} title={t.title} hint={t.reply} />
                    ))}
                    {/* Students don't need the form: their instructor sets access and deadlines. */}
                    {role !== "admin" && (
                        <TopicRow
                            tone="student"
                            to={role === "student" ? "/dashboard" : "/login"}
                            icon={GraduationCap}
                            title="Taking a quiz?"
                            hint="Your instructor can help with access and deadlines"
                        />
                    )}
                    <Link
                        to="/contact"
                        className="mt-2 self-start text-sm font-semibold text-brand underline-offset-4 hover:underline"
                    >
                        See every way to reach us →
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
