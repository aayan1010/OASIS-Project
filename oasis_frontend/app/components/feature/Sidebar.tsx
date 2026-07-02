"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { navigationItems } from "../../mocks/dashboard";
import { useState } from "react";
import OASISLOGOPURPLE from "../../../public/OASISLOGOPURPLE.svg";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-screen bg-background-50 border-r border-background-200/70 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-background-200/70">
        <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
          <Image
            src={OASISLOGOPURPLE}
            alt="OASIS Logo"
            className={`object-contain transition-all duration-300 ${collapsed ? "w-10 h-10" : "w-8 h-8"}`}
          />
        </div>
        {!collapsed && (
          <div className="ml-3 flex flex-col justify-center">
            <span className="font-heading font-semibold text-lg text-foreground-900 tracking-tight whitespace-nowrap leading-none">
              OASIS
            </span>
            <span className="text-[10px] font-medium text-primary-500 tracking-wider uppercase whitespace-nowrap leading-none mt-0.5">
              by Titan Systems
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto dashboard-scroll">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-foreground-600 hover:bg-background-100 hover:text-foreground-900"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-background-200/70">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-foreground-600 hover:bg-background-100 hover:text-foreground-900 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i
              className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-base`}
            ></i>
          </div>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}