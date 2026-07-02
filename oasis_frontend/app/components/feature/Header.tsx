"use client";

import { useState, useEffect } from "react";
import { recentAlerts } from "../../mocks/dashboard";

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (dark) {
        root.classList.add("dark");
        localStorage.setItem("oasis-theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("oasis-theme", "light");
      }
    }
  }, [dark]);

  return { dark, toggle: () => setDark((prev) => !prev) };
}

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemStatus] = useState<"online" | "degraded" | "offline">("online");
  const { dark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = recentAlerts.filter((a) => a.status === "active");

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background-50 border-b border-background-200/70 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground-500">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-line text-xs"></i>
          </div>
          <span>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground-700">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-time-line text-xs"></i>
          </div>
          <span>
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              systemStatus === "online"
                ? "bg-primary-500"
                : systemStatus === "degraded"
                  ? "bg-accent-500"
                  : "bg-red-500"
            }`}
          ></div>
          <span className="text-xs font-medium text-foreground-500 capitalize">
            {systemStatus}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-700 transition-colors"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <i className={`${dark ? "ri-sun-line" : "ri-moon-line"} text-base`}></i>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-700 transition-colors"
          >
            <i className="ri-notification-3-line text-base"></i>
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-accent-500 text-background-50 text-[10px] font-bold rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 top-11 w-96 bg-background-50 rounded-xl border border-background-200/70 shadow-lg z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70">
                  <h3 className="text-sm font-semibold text-foreground-900">
                    Notifications
                  </h3>
                  <span className="text-xs text-foreground-400">
                    {activeAlerts.length} active
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-background-100 transition-colors border-b border-background-100 last:border-b-0"
                    >
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                          alert.severity === "high"
                            ? "bg-accent-500"
                            : alert.severity === "medium"
                              ? "bg-accent-300"
                              : "bg-primary-300"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground-800 truncate">
                          {alert.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-foreground-400">
                            {alert.module}
                          </span>
                          <span className="text-xs text-foreground-300">
                            {alert.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                          alert.status === "active"
                            ? "bg-accent-100 text-accent-700"
                            : "bg-background-200 text-foreground-500"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-background-200/70">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
            OP
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground-800">Operator</p>
            <p className="text-xs text-foreground-400">Site Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
