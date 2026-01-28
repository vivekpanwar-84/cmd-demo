"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { MENU_ITEMS } from "./menu";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
        transition-all duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${collapsed ? "lg:w-20" : "lg:w-64"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="h-16 border-b flex items-center px-3 gap-3">
          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <Link
            href="/"
            className={`text-xl font-semibold transition-all whitespace-nowrap ${
              collapsed ? "lg:opacity-0 lg:w-0 overflow-hidden" : ""
            }`}
          >
            CRM<span className="text-primary">Pro</span>
          </Link>

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex ml-auto w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* NAV */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`
                      flex items-center gap-3 h-11 px-3 rounded-lg transition
                      ${
                        isActive
                          ? "bg-accent text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                      ${collapsed ? "lg:justify-center" : ""}
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="p-2 border-t">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 h-11 px-3 rounded-lg hover:bg-gray-100 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
