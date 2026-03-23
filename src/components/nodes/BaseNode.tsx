"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/lib/types";

interface BaseNodeProps {
  title: string;
  icon: ReactNode;
  status: NodeStatus;
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

export function BaseNode({
  title,
  icon,
  status,
  children,
  className,
  accentColor = "#7c3aed",
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        "min-w-65 max-w-[320px] rounded-xl border bg-[#0e0e0e] text-white shadow-2xl transition-all duration-200",
        status === "running" && "node-running",
        status === "success" && "border-green-500/40",
        status === "error" && "border-red-500/40",
        status === "idle" && "border-[#1e1e1e]",
        className
      )}
    >
      {/* Ambient glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${accentColor}08 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 rounded-t-xl px-3 py-2.5"
        style={{
          backgroundColor: `${accentColor}14`,
          borderBottom: `1px solid ${accentColor}28`,
        }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs"
          style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        >
          {icon}
        </span>
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {title}
        </span>

        {/* Status dot */}
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-all",
            status === "running" && "animate-pulse bg-yellow-400 shadow-sm shadow-yellow-400/60",
            status === "success" && "bg-green-400 shadow-sm shadow-green-400/60",
            status === "error" && "bg-red-400 shadow-sm shadow-red-400/60",
            status === "idle" && "bg-[#333]"
          )}
        />
      </div>

      {/* Body */}
      <div className="space-y-2.5 p-3">{children}</div>
    </div>
  );
}

export function NodeInput({
  label,
  disabled,
  children,
}: {
  label: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-semibold uppercase tracking-widest text-[#555]">
        {label}
      </label>
      <div className={cn(disabled && "pointer-events-none opacity-40")}>
        {children}
      </div>
      {disabled && (
        <p className="text-[9px] text-[#444]">Connected via handle</p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] px-2.5 py-1.5 text-xs text-white placeholder:text-[#444] focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors resize-none";
