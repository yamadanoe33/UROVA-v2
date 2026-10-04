"use client";

import { addDays } from "@/lib/cycle";

function weekday(date: Date) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date);
}

export default function CalendarStrip() {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, index) => addDays(today, index - 3));

  return (
    <div className="cycle-calendar-strip">
      {dates.map((date) => {
        const isToday = date.toDateString() === today.toDateString();
        return (
          <div key={date.toISOString()} className="cycle-calendar-day">
            <p>{isToday ? "Hari ini" : weekday(date)}</p>
            <div className={isToday ? "cycle-date active" : "cycle-date"}>{date.getDate()}</div>
          </div>
        );
      })}
    </div>
  );
}
