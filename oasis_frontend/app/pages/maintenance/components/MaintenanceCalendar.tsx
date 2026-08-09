"use client";

import { useState } from "react";
import { type CalendarEvent } from "../../../mocks/maintenance";
import { useWorkOrders, useDrills } from "../../../lib/api";

const drillTypeLabels: Record<string, string> = {
  "fire-evacuation": "Fire Evacuation",
  "hazmat-spill": "Hazmat Spill Response",
  "confined-space": "Confined Space Rescue",
  "medical-emergency": "Medical Emergency",
  "active-shooter": "Active Threat / Lockdown",
  "equipment-shutdown": "Emergency Equipment Shutdown",
  earthquake: "Earthquake / Natural Disaster",
};

const eventTypeStyles: Record<string, { bg: string; text: string; label: string }> = {
  pm: { bg: "bg-primary-100", text: "text-primary-700", label: "PM" },
  wo: { bg: "bg-secondary-100", text: "text-secondary-700", label: "WO" },
  inspection: { bg: "bg-accent-100", text: "text-accent-700", label: "INS" },
  downtime: { bg: "bg-foreground-100", text: "text-foreground-700", label: "DWN" },
  training: { bg: "bg-primary-50", text: "text-primary-600", label: "TRN" },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function MaintenanceCalendar() {
  const { data: workOrders } = useWorkOrders();
  const { data: drills } = useDrills();
  const workOrderEvents: CalendarEvent[] = workOrders.map((wo) => ({
    id: `evt-${wo.id}`,
    title: `${wo.category}: ${wo.asset}`,
    date: wo.createdDate,
    type: wo.category === "Preventative Maintenance" ? "pm" : wo.category === "Inspection" ? "inspection" : "wo",
    asset: wo.asset,
    assignee: wo.assignee,
    allDay: true,
  }));
  const drillEvents: CalendarEvent[] = drills.map((d) => ({
    id: `evt-${d.id}`,
    title: `Drill: ${drillTypeLabels[d.type] ?? d.type}`,
    date: d.date,
    type: "training",
    asset: d.site,
    startTime: d.time,
    description: d.notes,
    allDay: !d.time,
  }));
  const calendarEvents: CalendarEvent[] = [...workOrderEvents, ...drillEvents];
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayStr = today.toISOString().split("T")[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const getEventsForDate = (dateStr: string) => {
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ type: "empty", key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({ type: "day", day, dateStr, key: dateStr });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-heading font-semibold text-foreground-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-700 transition-colors"
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>
            <button
              onClick={goToNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-700 transition-colors"
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-3 text-xs">
            {Object.entries(eventTypeStyles).map(([type, style]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded ${style.bg} border border-current ${style.text}`}></div>
                <span className="text-foreground-500">{style.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-background-200/70">
          {dayNames.map((day) => (
            <div
              key={day}
              className="px-3 py-2 text-xs font-semibold text-foreground-500 uppercase tracking-wider text-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((cell) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={cell.key}
                  className="min-h-[120px] border-r border-b border-background-100/50 bg-background-50/50"
                ></div>
              );
            }

            const safeDateStr = cell.dateStr ?? "";
            const cellEvents = getEventsForDate(safeDateStr);
            const isToday = safeDateStr === todayStr;

            return (
              <div
                key={cell.key}
                className={`min-h-[120px] border-r border-b border-background-100/50 p-2 transition-colors hover:bg-background-100/50 ${
                  isToday ? "bg-primary-50/30" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? "w-7 h-7 flex items-center justify-center bg-primary-500 text-background-50 rounded-full"
                        : "text-foreground-700"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {cellEvents.length > 0 && (
                    <span className="text-[10px] text-foreground-400 font-medium">
                      {cellEvents.length} event{cellEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {cellEvents.map((event) => {
                    const style = eventTypeStyles[event.type] || eventTypeStyles.pm;
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate ${style.bg} ${style.text} hover:opacity-80 transition-opacity`}
                        title={`${event.title}${event.asset ? ` - ${event.asset}` : ""}`}
                      >
                        {event.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-background-50 rounded-xl border border-background-200/70 shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    eventTypeStyles[selectedEvent.type]?.bg || "bg-primary-100"
                  }`}
                >
                  <i className="ri-calendar-event-line text-sm text-primary-600"></i>
                </div>
                <h3 className="text-base font-semibold text-foreground-900">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-400 hover:bg-background-100 hover:text-foreground-700 transition-colors"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 flex items-center justify-center text-foreground-400">
                  <i className="ri-calendar-line text-sm"></i>
                </div>
                <span className="text-foreground-700">{selectedEvent.date}</span>
                {selectedEvent.startTime && (
                  <span className="text-foreground-500">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                )}
                {selectedEvent.allDay && (
                  <span className="text-xs bg-background-200 text-foreground-500 px-2 py-0.5 rounded-full">
                    All day
                  </span>
                )}
              </div>
              {selectedEvent.asset && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 flex items-center justify-center text-foreground-400">
                    <i className="ri-server-line text-sm"></i>
                  </div>
                  <span className="text-foreground-700">{selectedEvent.asset}</span>
                </div>
              )}
              {selectedEvent.assignee && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 flex items-center justify-center text-foreground-400">
                    <i className="ri-user-line text-sm"></i>
                  </div>
                  <span className="text-foreground-700">{selectedEvent.assignee}</span>
                </div>
              )}
              {selectedEvent.description && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 flex items-center justify-center text-foreground-400 flex-shrink-0">
                    <i className="ri-file-text-line text-sm"></i>
                  </div>
                  <span className="text-foreground-600">{selectedEvent.description}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 flex items-center justify-center text-foreground-400">
                  <i className="ri-price-tag-3-line text-sm"></i>
                </div>
                <span className="text-xs bg-background-200 text-foreground-600 px-2 py-1 rounded-full uppercase">
                  {selectedEvent.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
