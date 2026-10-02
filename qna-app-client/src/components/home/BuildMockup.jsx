import { useState } from "react";
import { useNavigate } from "react-router";
import { Minus, Plus } from "lucide-react";
import DateTimePicker from "@/components/DateTimePicker";
import { toLocalValue } from "@/lib/dateTime";
import GlowCard from "./GlowCard";

const defaultWindow = () => {
    const opens = new Date();
    opens.setDate(opens.getDate() + 1);
    opens.setHours(14, 0, 0, 0);
    const closes = new Date(opens);
    closes.setHours(16);
    return { opens: toLocalValue(opens), closes: toLocalValue(closes) };
};

const fieldClass =
    "mt-1 w-full rounded-lg bg-background px-3 py-2 text-sm font-medium ring-1 ring-border outline-none transition focus:ring-2 focus:ring-orange-500";

function Label({ htmlFor, children }) {
    return (
        <label
            htmlFor={htmlFor}
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
            {children}
        </label>
    );
}

function Stepper({ id, value, onChange, step, min, max, suffix }) {
    const clamp = (n) => Math.min(max, Math.max(min, n));
    return (
        <div className="mt-1 flex items-center rounded-lg bg-background ring-1 ring-border">
            <button
                type="button"
                aria-label={`Decrease ${id}`}
                onClick={() => onChange(clamp(value - step))}
                disabled={value <= min}
                className="px-3 py-2 text-muted-foreground transition hover:text-orange-600 disabled:opacity-40"
            >
                <Minus className="size-3.5" />
            </button>
            <span id={id} className="flex-1 text-center text-sm font-medium tabular-nums">
                {value} {suffix}
            </span>
            <button
                type="button"
                aria-label={`Increase ${id}`}
                onClick={() => onChange(clamp(value + step))}
                disabled={value >= max}
                className="px-3 py-2 text-muted-foreground transition hover:text-orange-600 disabled:opacity-40"
            >
                <Plus className="size-3.5" />
            </button>
        </div>
    );
}

export default function BuildMockup() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("Mid-term — Section B");
    const [{ opens, closes }, setWindow] = useState(defaultWindow);
    const [duration, setDuration] = useState(90);
    const [questions, setQuestions] = useState(32);

    const windowMinutes = (new Date(closes) - new Date(opens)) / 60000;

    let error = null;
    if (!title.trim()) error = "Give your quiz a title.";
    else if (!opens || !closes) error = "Pick when the quiz opens and closes.";
    else if (windowMinutes <= 0) error = "The window must close after it opens.";
    else if (duration > windowMinutes) error = "Duration is longer than the access window.";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) return;
        navigate("/register");
    };

    return (
        <GlowCard>
        <form onSubmit={handleSubmit} className="@container">
            <div className="flex items-center justify-between border-b border-border pb-3">
                <p className="text-sm font-semibold transition-colors duration-300 group-hover/glow:text-brand">New Quiz</p>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    DRAFT
                </span>
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <Label htmlFor="demo-title">Title</Label>
                    <input
                        id="demo-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={60}
                        className={fieldClass}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
                    <div>
                        <Label htmlFor="demo-opens">Opens</Label>
                        <DateTimePicker
                            id="demo-opens"
                            className="mt-1"
                            value={opens}
                            rangeStart={opens}
                            rangeEnd={closes}
                            onChange={(v) => setWindow((w) => ({ ...w, opens: v }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="demo-closes">Closes</Label>
                        <DateTimePicker
                            id="demo-closes"
                            className="mt-1"
                            align="end"
                            value={closes}
                            min={opens}
                            rangeStart={opens}
                            rangeEnd={closes}
                            onChange={(v) => setWindow((w) => ({ ...w, closes: v }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Stepper
                            id="duration"
                            value={duration}
                            onChange={setDuration}
                            step={15}
                            min={15}
                            max={240}
                            suffix="min"
                        />
                    </div>
                    <div>
                        <Label htmlFor="questions">Questions</Label>
                        <Stepper
                            id="questions"
                            value={questions}
                            onChange={setQuestions}
                            step={1}
                            min={1}
                            max={200}
                            suffix="added"
                        />
                    </div>
                </div>

                <p
                    role="status"
                    className={`min-h-5 text-xs font-medium ${error ? "text-red-600" : "text-green-600"}`}
                >
                    {error ?? "Everything checks out — ready to publish."}
                </p>

                <button
                    type="submit"
                    disabled={Boolean(error)}
                    className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Publish quiz →
                </button>
            </div>
        </form>
        </GlowCard>
    );
}
