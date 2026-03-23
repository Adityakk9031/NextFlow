"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Clock,
  Zap,
} from "lucide-react";
import useSWR from "swr";
import { useWorkflowStore } from "@/store/workflow-store";
import { cn } from "@/lib/utils";

interface NodeRun {
  id: string;
  nodeId: string;
  nodeType: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
  inputs: unknown;
  outputs: unknown;
  error?: string;
  duration?: number;
}

interface WorkflowRun {
  id: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
  scope: "FULL" | "PARTIAL" | "SINGLE";
  startedAt: string;
  duration?: number;
  nodeRuns: NodeRun[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function RightSidebar() {
  const { rightSidebarOpen, toggleRightSidebar, workflowId, isRunning } =
    useWorkflowStore();

  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const { data } = useSWR<{ data: WorkflowRun[] }>(
    workflowId ? `/api/history/${workflowId}` : null,
    fetcher,
    { refreshInterval: isRunning ? 2000 : 10000 }
  );

  const runs = data?.data ?? [];

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-l border-[#1a1a1a] bg-[#0c0c0c] transition-all duration-300",
        rightSidebarOpen ? "w-72" : "w-12"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggleRightSidebar}
        className="absolute -left-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#1e1e1e] bg-[#141414] text-[#555] shadow-lg transition-all hover:border-violet-500/40 hover:text-violet-400"
      >
        {rightSidebarOpen ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {rightSidebarOpen ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3.5">
            <History size={13} className="text-[#444]" />
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">
              Run History
            </h2>
            {runs.length > 0 && (
              <span className="ml-auto rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[9px] font-semibold text-[#555]">
                {runs.length}
              </span>
            )}
          </div>

          {/* Runs list */}
          <div className="flex-1 overflow-y-auto">
            {runs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a1a1a] bg-[#0e0e0e]">
                  <History size={20} className="text-[#2a2a2a]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#444]">No runs yet</p>
                  <p className="mt-1 text-[10px] text-[#333]">
                    Press Run to execute workflow
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-px p-2">
                {runs.map((run) => (
                  <RunEntry
                    key={run.id}
                    run={run}
                    expanded={expandedRun === run.id}
                    onToggle={() =>
                      setExpandedRun(expandedRun === run.id ? null : run.id)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center pt-14">
          <div
            title="Run History"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] text-[#444]"
          >
            <History size={14} />
          </div>
          {runs.length > 0 && (
            <span className="mt-1 text-[9px] font-semibold text-[#444]">
              {runs.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function RunEntry({
  run,
  expanded,
  onToggle,
}: {
  run: WorkflowRun;
  expanded: boolean;
  onToggle: () => void;
}) {
  const startTime = new Date(run.startedAt);
  const timeAgo = getTimeAgo(startTime);

  const statusConfig = {
    SUCCESS: { dot: "bg-green-400", text: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    FAILED: { dot: "bg-red-400", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    RUNNING: { dot: "bg-yellow-400 animate-pulse", text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    PARTIAL: { dot: "bg-orange-400", text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  };
  const cfg = statusConfig[run.status] ?? { dot: "bg-[#444]", text: "text-[#888]", bg: "bg-[#1a1a1a] border-[#222]" };

  return (
    <div className="rounded-lg border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
      <button
        onClick={onToggle}
        type="button"
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#131313]"
      >
        <div className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cfg.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-[10px] font-semibold uppercase", cfg.text)}>
              {run.status}
            </span>
            <span className="rounded bg-[#1a1a1a] px-1 py-0.5 text-[8px] font-medium uppercase text-[#555]">
              {run.scope}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[9px] text-[#444]">
            <span className="flex items-center gap-0.5">
              <Clock size={8} />
              {timeAgo}
            </span>
            {run.duration && (
              <span className="flex items-center gap-0.5">
                <Zap size={8} />
                {(run.duration / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          size={11}
          className={cn(
            "shrink-0 text-[#444] transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Node-level details */}
      {expanded && run.nodeRuns.length > 0 && (
        <div className="border-t border-[#1a1a1a] px-2 py-2 space-y-1">
          {run.nodeRuns.map((nr) => (
            <NodeRunRow key={nr.id} nr={nr} />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeRunRow({ nr }: { nr: NodeRun }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#191919] bg-[#0a0a0a] px-2 py-1.5">
      <StatusIcon status={nr.status} size={10} />
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-medium text-[#888]">
          {nr.nodeType}
        </span>
        {nr.error && (
          <p className="mt-0.5 text-[9px] text-red-400/80 wrap-break-word">{nr.error}</p>
        )}
      </div>
      {nr.duration && (
        <span className="shrink-0 text-[9px] text-[#444]">
          {nr.duration}ms
        </span>
      )}
    </div>
  );
}

function StatusIcon({ status, size = 12 }: { status: string; size?: number }) {
  if (status === "SUCCESS")
    return <CheckCircle2 size={size} className="mt-0.5 shrink-0 text-green-400" />;
  if (status === "FAILED")
    return <XCircle size={size} className="mt-0.5 shrink-0 text-red-400" />;
  if (status === "RUNNING")
    return <Loader2 size={size} className="mt-0.5 shrink-0 animate-spin text-yellow-400" />;
  return <AlertCircle size={size} className="mt-0.5 shrink-0 text-orange-400" />;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString();
}
