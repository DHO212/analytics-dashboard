"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Gear,
  SignOut,
  Moon,
  Sun,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  action: () => void;
  danger?: boolean;
  divider?: boolean;
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();

  const close = () => setOpen(false);

  // Outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const items: MenuItem[] = [
    {
      id: "profile",
      label: "Profile",
      description: "ridho@meridian.app",
      icon: User,
      action: () => { router.push("/settings"); close(); },
    },
    {
      id: "settings",
      label: "Settings",
      description: "Workspace & account",
      icon: Gear,
      action: () => { router.push("/settings"); close(); },
    },
    {
      id: "theme",
      label: theme === "light" ? "Switch to Dark" : "Switch to Light",
      description: `Currently ${theme} mode`,
      icon: theme === "light" ? Moon : Sun,
      action: () => { toggleTheme(); close(); },
      divider: true,
    },
    {
      id: "signout",
      label: "Sign out",
      icon: SignOut,
      action: () => { router.push("/login"); close(); },
      danger: true,
      divider: true,
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* User chip */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-[6px] px-2 py-1.5",
          "text-[rgb(var(--text-2))] transition-all duration-100",
          "hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]",
          "active:scale-[0.97]",
          open && "bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]"
        )}
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="avatar-bg flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white">
          RK
        </div>
        <span className="hidden text-[12px] font-medium sm:block">Ridho</span>
        <CaretRight
          size={10}
          className={cn(
            "hidden sm:block text-[rgb(var(--text-3))] transition-transform duration-150",
            open && "rotate-90"
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "absolute right-0 top-full mt-2 w-[220px] z-50",
              "rounded-xl border border-[rgb(var(--border))]",
              "bg-[rgb(var(--surface))] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]",
              "py-1.5"
            )}
          >
            {/* User info header */}
            <div className="flex items-center gap-2.5 border-b border-[rgb(var(--border))] px-3.5 pb-2.5 pt-2 mb-1">
              <div className="avatar-bg flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
                RK
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-[rgb(var(--text))] leading-tight">
                  Ridho K.
                </p>
                <p className="truncate text-[11px] text-[rgb(var(--text-3))]">
                  ridho@meridian.app
                </p>
              </div>
            </div>

            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  {item.divider && (
                    <div className="my-1 border-t border-[rgb(var(--border))]" />
                  )}
                  <button
                    onClick={item.action}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3.5 py-2 text-left",
                      "text-[12.5px] transition-colors",
                      item.danger
                        ? "text-[rgb(var(--negative))] hover:bg-[rgb(var(--negative)/0.08)]"
                        : "text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]"
                    )}
                  >
                    <Icon
                      size={14}
                      className={item.danger ? "" : "text-[rgb(var(--text-3))]"}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">{item.label}</span>
                      {item.description && (
                        <p className="truncate text-[10.5px] text-[rgb(var(--text-3))] font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
