"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { navigationItems } from "../../mocks/dashboard";
import { useState } from "react";
import OASISLOGOPURPLE from "../../../public/OASISLOGOPURPLE.svg";

const iconMap: Record<string, React.ReactNode> = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M14 21C13.4477 21 13 20.5523 13 20V12C13 11.4477 13.4477 11 14 11H20C20.5523 11 21 11.4477 21 12V20C21 20.5523 20.5523 21 20 21H14ZM4 13C3.44772 13 3 12.5523 3 12V4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V12C11 12.5523 10.5523 13 10 13H4ZM9 11V5H5V11H9ZM4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 3.44772 15 4 15H10C10.5523 15 11 15.4477 11 16V20C11 20.5523 10.5523 21 10 21H4ZM5 19H9V17H5V19ZM15 19H19V13H15V19ZM13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 20.5523 9 20 9H14C13.4477 9 13 8.55228 13 8V4ZM15 5V7H19V5H15Z"/>
    </svg>
  ),
  performance: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 12H5V21H3V12ZM19 8H21V21H19V8ZM11 2H13V21H11V2Z"/>
    </svg>
  ),
  alerts: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z"/>
    </svg>
  ),
  sites: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M10 10.1111V1L21 7V21H3V7L10 10.1111ZM12 4.36908V13.1886L5 10.0775V19H19V8.18727L12 4.36908Z"/>
    </svg>
  ),
  maintenance: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5.32943 3.27158C6.56252 2.8332 7.9923 3.10749 8.97927 4.09446C10.1002 5.21537 10.3019 6.90741 9.5843 8.23385L20.293 18.9437L18.8788 20.3579L8.16982 9.64875C6.84325 10.3669 5.15069 10.1654 4.02952 9.04421C3.04227 8.05696 2.7681 6.62665 3.20701 5.39332L5.44373 7.63C6.02952 8.21578 6.97927 8.21578 7.56505 7.63C8.15084 7.04421 8.15084 6.09446 7.56505 5.50868L5.32943 3.27158ZM15.6968 5.15512L18.8788 3.38736L20.293 4.80157L18.5252 7.98355L16.7574 8.3371L14.6361 10.4584L13.2219 9.04421L15.3432 6.92289L15.6968 5.15512ZM8.97927 13.2868L10.3935 14.7011L5.09018 20.0044C4.69966 20.3949 4.06649 20.3949 3.67597 20.0044C3.31334 19.6417 3.28744 19.0699 3.59826 18.6774L3.67597 18.5902L8.97927 13.2868Z"/>
    </svg>
  ),
};
 
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
            width={40}
            height={40}
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
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {iconMap[item.id]}
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
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M15.6315 12L10.8838 3.03212L9.11622 3.9679L13.3685 12L9.11622 20.0321L10.8838 20.9679L15.6315 12Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8.3685 12L13.1162 3.03212L14.8838 3.9679L10.6315 12L14.8838 20.0321L13.1162 20.9679L8.3685 12Z"/>
              </svg>
            )}
          </div>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}