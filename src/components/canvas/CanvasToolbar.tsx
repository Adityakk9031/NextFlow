"use client";

import { useCallback } from "react";
import {
  Play,
  Save,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
  Loader2,
  Zap,
} from "lucide-react";
import { useWorkflowStore } from "@/store/workflow-store";
import { cn } from "@/lib/utils";

interface CanvasToolbarProps {
  workflowId: string;
  onSave: () => void;
  onRun: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CanvasToolbar({
  workflowId: _workflowId,
  onSave,
  onRun,
  onExport,
  onImport,
}: CanvasToolbarProps) {
  const { undo, redo, resetCanvas, past, future, isSaving, isRunning, workflowName, setWorkflowName } =
    useWorkflowStore();

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWorkflowName(e.target.value);
    },
    [setWorkflowName]
  );

  return (
    <div className="flex items-center gap-1.5 border-b border-[#1a1a1a] bg-[#0c0c0c] px-4 py-2">
      {/* Logo mark */}
      <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-md bg-violet-600/20">
        <Zap size={12} className="text-violet-400" />
      </div>

      {/* Workflow name */}
      <input
        type="text"
        value={workflowName}
        onChange={handleNameChange}
        className="h-8 w-44 rounded-lg border border-[#1e1e1e] bg-transparent px-2.5 text-sm font-medium text-white/90 transition-colors focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 hover:border-[#2a2a2a]"
        placeholder="Untitled Workflow"
      />

      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton
        icon={<Undo2 size={13} />}
        tooltip="Undo (⌘Z)"
        onClick={undo}
        disabled={past.length === 0}
      />
      <ToolbarButton
        icon={<Redo2 size={13} />}
        tooltip="Redo (⌘⇧Z)"
        onClick={redo}
        disabled={future.length === 0}
      />

      <Divider />

      {/* Clear canvas */}
      <ToolbarButton
        icon={<Trash2 size={13} />}
        tooltip="Clear canvas"
        onClick={resetCanvas}
        variant="danger"
      />

      <Divider />

      {/* Import */}
      <label className="cursor-pointer">
        <ToolbarButton
          icon={<Upload size={13} />}
          tooltip="Import JSON"
          onClick={() => {}}
        />
        <input
          type="file"
          accept=".json"
          className="hidden"
          onChange={onImport}
        />
      </label>

      {/* Export */}
      <ToolbarButton
        icon={<Download size={13} />}
        tooltip="Export JSON"
        onClick={onExport}
      />

      <div className="flex-1" />

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-1.5 rounded-lg border border-[#1e1e1e] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#aaa] transition-all hover:border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSaving ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Save size={12} />
        )}
        {isSaving ? "Saving…" : "Save"}
      </button>

      {/* Run */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunning ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Running…
          </>
        ) : (
          <>
            <Play size={12} />
            Run
          </>
        )}
      </button>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-[#1e1e1e]" />;
}

function ToolbarButton({
  icon,
  tooltip,
  onClick,
  disabled,
  variant,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg text-[#555] transition-all hover:bg-[#1a1a1a] hover:text-[#aaa] disabled:cursor-not-allowed disabled:opacity-25",
        variant === "danger" && "hover:bg-red-500/10 hover:text-red-400"
      )}
    >
      {icon}
    </button>
  );
}
