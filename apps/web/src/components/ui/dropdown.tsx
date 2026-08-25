"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CaretDown, Check } from "@phosphor-icons/react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({ options, value, onChange, placeholder = "Select...", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm transition-all",
          "active:scale-[0.99] focus:outline-none",
          "border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))]",
          "hover:border-[rgb(var(--text-2)/0.5)] hover:bg-[rgb(var(--surface-2))]"
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <CaretDown
          size={13}
          weight="bold"
          className={cn(
            "shrink-0 transition-transform",
            "text-[rgb(var(--text-2))]",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full min-w-[160px] rounded-xl border py-1",
            "border-[rgb(var(--border))] bg-[rgb(var(--surface))]",
            "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.08)]",
            "animate-fade-in"
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                option.value === value
                  ? "bg-[rgb(var(--accent)/0.12)] font-medium text-[rgb(var(--accent))]"
                  : "text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
              )}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={13} weight="bold" className="text-[rgb(var(--accent))]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
