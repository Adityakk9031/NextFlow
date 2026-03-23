"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Plus,
  Workflow,
  Trash2,
  Loader2,
  Zap,
  ArrowRight,
  Clock,
} from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  updatedAt: string;
  _count: { runs: number };
}

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/workflows")
      .then((r) => r.json())
      .then(({ data }) => setWorkflows(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const createWorkflow = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Workflow", nodes: [], edges: [] }),
      });
      const { data } = await res.json();
      router.push(`/workflows/${data.id}`);
    } finally {
      setCreating(false);
    }
  };

  const deleteWorkflow = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/workflows/${id}`, { method: "DELETE" });
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#080808]">
      {/* ── Ambient gradient ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#1a1a1a] px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-lg shadow-violet-500/25">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            NextFlow
          </span>
          <span className="ml-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={createWorkflow}
            disabled={creating}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 disabled:opacity-50"
          >
            {creating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            New Workflow
          </button>
          <UserButton />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 px-8 py-8">
        {/* Hero text */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            My Workflows
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            Build and run visual LLM pipelines
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={22} className="animate-spin text-violet-400" />
          </div>
        ) : workflows.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#1e1e1e] bg-[#101010] shadow-2xl">
              <Workflow size={36} className="text-[#333]" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-white">
              No workflows yet
            </h2>
            <p className="mb-8 max-w-sm text-sm text-[#555]">
              Create your first LLM workflow. Drag nodes, connect them, and run
              AI pipelines visually.
            </p>
            <button
              type="button"
              onClick={createWorkflow}
              disabled={creating}
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-xl shadow-violet-500/20 transition-all hover:bg-violet-500 disabled:opacity-50"
            >
              <Plus size={15} />
              Create your first workflow
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* New workflow card */}
            <button
              type="button"
              onClick={createWorkflow}
              disabled={creating}
              aria-label="New Workflow"
              className="group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1e1e1e] bg-transparent p-6 text-[#444] transition-all hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-400 disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-current/5 transition-all group-hover:scale-110">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium">New Workflow</span>
            </button>

            {workflows.map((wf, i) => (
              <WorkflowCard
                key={wf.id}
                wf={wf}
                index={i}
                onClick={() => router.push(`/workflows/${wf.id}`)}
                onDelete={deleteWorkflow}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function WorkflowCard({
  wf,
  index,
  onClick,
  onDelete,
}: {
  wf: WorkflowItem;
  index: number;
  onClick: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  const colors = [
    { bg: "bg-violet-500/10", text: "text-violet-400", shadow: "shadow-violet-500/10" },
    { bg: "bg-blue-500/10", text: "text-blue-400", shadow: "shadow-blue-500/10" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400", shadow: "shadow-cyan-500/10" },
    { bg: "bg-emerald-500/10", text: "text-emerald-400", shadow: "shadow-emerald-500/10" },
  ];
  const color = colors[index % colors.length];

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 shadow-xl transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#121212] hover:shadow-2xl fade-up`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />

      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.bg} shadow-lg ${color.shadow}`}>
          <Workflow size={18} className={color.text} />
        </div>
        <button
          type="button"
          onClick={(e) => onDelete(wf.id, e)}
          title="Delete workflow"
          aria-label="Delete workflow"
          className="opacity-0 transition-all duration-150 group-hover:opacity-100 text-[#333] hover:text-red-400 hover:scale-110"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <h3 className="mt-4 font-semibold text-white leading-snug">{wf.name}</h3>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-[#444]">
        <span className="flex items-center gap-1">
          <Zap size={10} className="text-[#333]" />
          {wf._count.runs} run{wf._count.runs !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} className="text-[#333]" />
          {new Date(wf.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Open arrow */}
      <div className="mt-4 flex items-center justify-end">
        <span className="flex items-center gap-1 text-[11px] text-[#333] transition-all group-hover:text-violet-400">
          Open <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}
