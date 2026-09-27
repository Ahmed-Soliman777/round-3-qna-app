// Calendar exports for a quiz window: a Google Calendar link and an .ics file
// (Apple Calendar, Outlook). Both cover the whole window the quiz is open.

const REMINDER_MINUTES = 30;

// 2026-09-28T09:00:00.000Z -> 20260928T090000Z
const toIcsDate = (date) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// RFC 5545 text escaping: backslash, semicolon, comma, newline.
const escapeText = (text) =>
    String(text ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Lines longer than 75 octets must be folded onto continuation lines.
const fold = (line) => {
    const parts = [];
    for (let i = 0; i < line.length; i += 73) parts.push((i ? " " : "") + line.slice(i, i + 73));
    return parts.join("\r\n");
};

function quizEvent(quiz) {
    const url = `${window.location.origin}/quiz/${quiz.id}/instructions`;
    return {
        title: `Quiz: ${quiz.title}`,
        start: quiz.starts_at,
        end: quiz.ends_at ?? quiz.deadline,
        url,
        details: `${quiz.duration} minute quiz on Quizgate. It can be started any time while the window is open.\n${url}`,
    };
}

export function canAddToCalendar(quiz, now = new Date()) {
    const end = quiz.ends_at ?? quiz.deadline;
    return Boolean(quiz.starts_at && end) && quiz.state !== "submitted" && new Date(end) > now;
}

export function googleCalendarUrl(quiz) {
    const event = quizEvent(quiz);
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        dates: `${toIcsDate(event.start)}/${toIcsDate(event.end)}`,
        details: event.details,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
}

export function downloadQuizIcs(quiz) {
    const event = quizEvent(quiz);
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Quizgate//Quiz window//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:quiz-${quiz.id}@quizgate`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(event.start)}`,
        `DTEND:${toIcsDate(event.end)}`,
        `SUMMARY:${escapeText(event.title)}`,
        `DESCRIPTION:${escapeText(event.details)}`,
        `URL:${event.url}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText(`${event.title} opens soon`)}`,
        `TRIGGER:-PT${REMINDER_MINUTES}M`,
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
    ];

    const blob = new Blob([lines.map(fold).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${quiz.title.replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "") || "quiz"}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
}
