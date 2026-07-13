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
  const [mounted, setMounted] = useState(false); // 1. Add a mounted state
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemStatus] = useState<"online" | "degraded" | "offline">("online");
  const { dark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true); // 2. Set mounted to true once the client takes over
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
            {mounted ? currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground-700">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-time-line text-xs"></i>
          </div>
          <span>
            {mounted ? currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }) : ""}
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
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"/>
            </svg>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12.5557 24H7.66699v-2.5h4.88871zM10.2314 3.5c0.4058 0.00001 0.8037 0.03422 1.1915 0.09766C11.1491 4.34686 11 5.15603 11 6c0 0.02053 0.0008 0.04103 0.001 0.06152 -0.2507 -0.04024 -0.5077 -0.06151 -0.7696 -0.06152 -2.67255 0 -4.84859 2.17748 -4.84859 4.875v4.7051l-0.16308 0.2871L4.29297 17.5H16.1689l-0.9267 -1.6328 -0.1621 -0.2871v-3.2188c0.7687 0.3535 1.6116 0.5725 2.5 0.625v1.9336l1.8232 3.2129L20.4629 20H0l1.05957 -1.8672 1.82324 -3.2129V10.875c0 -4.06797 3.28509 -7.375 7.34859 -7.375M18 1c2.7614 0 5 2.23858 5 5s-2.2386 5 -5 5 -5 -2.23858 -5 -5 2.2386 -5 5 -5" strokeWidth="1"/>
            </svg>
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
                        className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
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
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
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
