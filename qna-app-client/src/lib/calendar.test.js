// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { canAddToCalendar, downloadQuizIcs, googleCalendarUrl } from "./calendar";

// Plain Node environment (the repo's jsdom needs Node 22+), so stub the bits of the DOM used.
vi.stubGlobal("window", { location: { origin: "http://localhost:5180" } });

const quiz = {
    id: "q1",
    title: "Midterm; logic, aptitude",
    duration: 45,
    starts_at: "2026-10-01T09:00:00.000Z",
    deadline: "2026-10-01T11:00:00.000Z",
    state: "not_started",
};

describe("canAddToCalendar", () => {
    const now = new Date("2026-09-30T12:00:00.000Z");

    it("allows upcoming and open quizzes", () => {
        expect(canAddToCalendar(quiz, now)).toBe(true);
    });

    it("hides the option once submitted or closed", () => {
        expect(canAddToCalendar({ ...quiz, state: "submitted" }, now)).toBe(false);
        expect(canAddToCalendar(quiz, new Date("2026-10-02T00:00:00.000Z"))).toBe(false);
    });
});

describe("googleCalendarUrl", () => {
    it("covers the quiz window in UTC", () => {
        const url = new URL(googleCalendarUrl(quiz));
        expect(url.searchParams.get("dates")).toBe("20261001T090000Z/20261001T110000Z");
        expect(url.searchParams.get("text")).toBe("Quiz: Midterm; logic, aptitude");
    });
});

describe("downloadQuizIcs", () => {
    afterEach(() => vi.restoreAllMocks());

    it("builds an escaped event with a 30 minute reminder", async () => {
        let blob;
        const link = { click: vi.fn(), remove: vi.fn() };
        vi.stubGlobal("document", { createElement: () => link, body: { appendChild: vi.fn() } });
        vi.spyOn(URL, "createObjectURL").mockImplementation((b) => ((blob = b), "blob:ics"));
        vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

        downloadQuizIcs(quiz);
        const text = await blob.text();

        expect(text).toContain("DTSTART:20261001T090000Z\r\n");
        expect(text).toContain("DTEND:20261001T110000Z\r\n");
        expect(text).toContain("SUMMARY:Quiz: Midterm\\; logic\\, aptitude\r\n");
        expect(text).toContain("TRIGGER:-PT30M");
        expect(text).toContain("URL:http://localhost:5180/quiz/q1/instructions");
        expect(link.download).toBe("Midterm-logic-aptitude.ics");
        expect(link.click).toHaveBeenCalled();
        expect(text.split("\r\n").every((line) => line.length <= 75)).toBe(true);
    });
});
