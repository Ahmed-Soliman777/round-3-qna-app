import { useNavigate } from "react-router";
import { ArrowRight, CalendarClock, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNow } from "@/hooks/useNow";
import { formatDateTime, formatDuration, quizWindowState } from "@/lib/quizStatus";
import { cn } from "@/lib/utils";
import { canAddToCalendar } from "@/lib/calendar";
import AddToCalendar from "@/components/AddToCalendar";

const stateStyles = {
  not_started: "bg-student-soft text-student",
  in_progress: "bg-yellow-100 text-yellow-700",
  submitted: "bg-green-100 text-green-700",
};

const stateLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  submitted: "Submitted",
};

const windowOf = (quiz, now) => quizWindowState({ starts_at: quiz.starts_at, ends_at: quiz.deadline }, now);

// What the student can do right now, based on the quiz window and their attempt.
function availabilityLine(quiz, now) {
  const window = windowOf(quiz, now);
  if (quiz.state === "submitted") return { text: "Completed", tone: "text-green-700" };
  if (window === "upcoming") {
    return { text: `Opens in ${formatDuration(new Date(quiz.starts_at) - now)}`, tone: "text-student" };
  }
  if (window === "closed") return { text: "Closed — the deadline has passed", tone: "text-red-700" };
  return {
    text: `${quiz.state === "in_progress" ? "In progress" : "Open now"} · closes in ${formatDuration(new Date(quiz.deadline) - now)}`,
    tone: "text-green-700",
  };
}

// Label for where clicking the card leads.
function actionLabel(quiz, now) {
  if (quiz.state === "submitted" || windowOf(quiz, now) !== "open") return "View details";
  return quiz.state === "in_progress" ? "Resume quiz" : "Start quiz";
}

export default function QuizCard({ quiz }) {
  const navigate = useNavigate();
  const now = useNow();
  const availability = availabilityLine(quiz, now);
  const open = () => navigate(`/quiz/${quiz.id}/instructions`);

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter") open();
      }}
      className="group cursor-pointer overflow-visible transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-student/40 focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-student focus-visible:outline-none"
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl">{quiz.title}</CardTitle>
          <Badge className={stateStyles[quiz.state]}>
            {stateLabels[quiz.state] ?? quiz.state}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Timer className="size-4" /> {quiz.duration} minutes
        </p>
        {quiz.starts_at && (
          <p className="flex items-center gap-2">
            <CalendarClock className="size-4" /> {formatDateTime(quiz.starts_at)} → {formatDateTime(quiz.deadline)}
          </p>
        )}
        <p className={cn("pt-1 font-semibold", availability.tone)}>{availability.text}</p>
        {canAddToCalendar(quiz, now) && <AddToCalendar quiz={quiz} className="pt-2" />}
        <p className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold text-foreground transition-colors duration-300 group-hover:text-student">
          {actionLabel(quiz, now)}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </p>
      </CardContent>
    </Card>
  );
}
