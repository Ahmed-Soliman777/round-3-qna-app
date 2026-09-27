import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ArrowUpRight, ClipboardCheck, Lock, MailOpen, Send } from "lucide-react";
import Reveal from "@/components/Reveal";
import DoorCard from "@/components/home/DoorCard";
import { useSession } from "@/context/session";
import { cn } from "@/lib/utils";

const iconTile =
    "flex size-11 items-center justify-center rounded-xl transition-[rotate,scale,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=active]:-rotate-6 group-data-[state=active]:scale-110";
const cornerArrow =
    "absolute right-6 top-6 size-5 -translate-x-1 translate-y-1 opacity-0 transition-[translate,opacity] duration-300 group-data-[state=active]:translate-x-0 group-data-[state=active]:translate-y-0 group-data-[state=active]:opacity-100";
const tones = {
    brand: {
        icon: "bg-brand-soft text-brand group-data-[state=active]:bg-brand group-data-[state=active]:text-brand-foreground",
        text: "text-brand",
        button: "bg-brand text-brand-foreground",
        focus: "focus-visible:ring-2 focus-visible:ring-brand/50",
    },
    student: {
        icon: "bg-student-soft text-student group-data-[state=active]:bg-student group-data-[state=active]:text-student-foreground",
        text: "text-student",
        button: "bg-student text-student-foreground",
        focus: "focus-visible:ring-2 focus-visible:ring-student/50",
    },
};

function DoorBody({ tone, icon: Icon, eyebrow, title, children }) {
    const t = tones[tone];
    return (
        <>
            <span className={cn(iconTile, t.icon)}>
                <Icon className="size-5" />
            </span>
            <p className={cn("mt-5 text-sm font-semibold uppercase tracking-wide", t.text)}>{eyebrow}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{children}</p>
        </>
    );
}

// A door that is one big link: the whole card navigates, the "button" is visual only.
function LinkDoor({ tone, to, linkState, cta, mode, events, ...body }) {
    const t = tones[tone];
    return (
        <DoorCard as={Link} to={to} state={linkState} tone={tone} mode={mode} {...events} className={t.focus}>
            <ArrowUpRight className={cn(cornerArrow, t.text)} />
            <DoorBody tone={tone} {...body} />
            <div className="mt-auto pt-6">
                <span className={cn("inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-opacity group-hover:opacity-90 sm:w-auto", t.button)}>
                    {cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-data-[state=active]:translate-x-1" />
                </span>
            </div>
        </DoorCard>
    );
}

// A door the current account can't use: explained, not clickable, never lights up.
function LockedDoor({ tone, ...body }) {
    return (
        <DoorCard tone={tone} className="bg-muted/40 shadow-none">
            <DoorBody tone={tone} {...body} icon={Lock} />
        </DoorCard>
    );
}

// "Pick your door": one door for admins (orange), one for students.
// Signed-in visitors see doors that match their role instead of sign-up and sign-in prompts.
export default function PickYourDoor() {
    const navigate = useNavigate();
    const { user } = useSession();
    const role = user?.role ?? "guest";
    const emailRef = useRef(null);
    const [email, setEmail] = useState("");
    const [active, setActive] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/register", { state: { email: email.trim() } });
    };

    // Mouse hover drives the doors; touch gets the press effect instead of a sticky hover.
    const doorEvents = (door) => ({
        onPointerEnter: (e) => e.pointerType === "mouse" && setActive(door),
        onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null),
        onFocus: () => setActive(door),
        onBlur: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
        },
    });
    const stateOf = (door) => (active === null ? "idle" : active === door ? "active" : "dimmed");

    const adminDoor = {
        admin: (
            <LinkDoor
                tone="brand"
                to="/admin-panel/quizzes"
                linkState={{ openCreate: true }}
                cta="Create quiz"
                mode={stateOf("admin")}
                events={doorEvents("admin")}
                icon={ClipboardCheck}
                eyebrow="I run quizzes"
                title="Publish your next quiz"
            >
                Start a new quiz right away: set the window, add questions, then publish.
            </LinkDoor>
        ),
        student: (
            <LockedDoor tone="brand" eyebrow="I run quizzes" title="Admins create quizzes">
                You're signed in as a student, so you can take quizzes but not create them. Your instructor
                invites you to each quiz.
            </LockedDoor>
        ),
        guest: (
            <DoorCard
                tone="brand"
                mode={stateOf("admin")}
                {...doorEvents("admin")}
                // Clicking anywhere on the door (outside the form) jumps to the email field.
                onClick={(e) => {
                    if (!e.target.closest("form")) emailRef.current?.focus();
                }}
                className="cursor-pointer"
            >
                <ArrowUpRight className={cn(cornerArrow, "text-brand")} />
                <DoorBody tone="brand" icon={ClipboardCheck} eyebrow="I run quizzes" title="Publish your first quiz">
                    One admin seat, free forever. No credit card.
                </DoorBody>
                <form
                    onSubmit={handleSubmit}
                    className="mt-auto flex cursor-auto flex-col gap-3 pt-6 sm:flex-row sm:rounded-full sm:bg-background sm:p-1.5 sm:ring-1 sm:ring-border sm:transition-shadow sm:focus-within:ring-2 sm:focus-within:ring-brand"
                >
                    <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.edu"
                        aria-label="Email address"
                        className="min-w-0 flex-1 rounded-full bg-background px-4 py-3 text-sm ring-1 ring-border outline-none sm:bg-transparent sm:py-2 sm:ring-0"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover sm:py-2.5"
                    >
                        Start free
                        <ArrowRight className="size-4 transition-transform duration-300 group-data-[state=active]:translate-x-1" />
                    </button>
                </form>
            </DoorCard>
        ),
    }[role];

    const studentDoor = {
        admin: (
            <LinkDoor
                tone="student"
                to="/admin-panel/quizzes"
                cta="Invite students"
                mode={stateOf("student")}
                events={doorEvents("student")}
                icon={Send}
                eyebrow="For your students"
                title="Invite your students"
            >
                Students join by invite. Send invites from any published quiz and they'll get an email and a
                notification.
            </LinkDoor>
        ),
        student: (
            <LinkDoor
                tone="student"
                to="/dashboard"
                cta="Go to my quizzes"
                mode={stateOf("student")}
                events={doorEvents("student")}
                icon={MailOpen}
                eyebrow="I take quizzes"
                title="Your quizzes are waiting"
            >
                See what's open now, what's coming up, and what you've already finished.
            </LinkDoor>
        ),
        guest: (
            <LinkDoor
                tone="student"
                to="/login"
                cta="Sign in to my quizzes"
                mode={stateOf("student")}
                events={doorEvents("student")}
                icon={MailOpen}
                eyebrow="I take quizzes"
                title="Got an invite?"
            >
                Open the link in your email, or sign in to see every quiz you've been invited to.
            </LinkDoor>
        ),
    }[role];

    return (
        <section className="border-t border-border py-16">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <Reveal className="text-center">
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pick your door.</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Whether you're running the quiz or taking it, you're one step away.
                    </p>
                </Reveal>

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <Reveal className="h-full">{adminDoor}</Reveal>
                    <Reveal delay={120} className="h-full">
                        {studentDoor}
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
