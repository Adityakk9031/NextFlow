"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Handle, Position, useEdges, type NodeProps } from "reactflow";
import { Brain, ChevronDown, Loader2 } from "lucide-react";
import { BaseNode, NodeInput, inputClass } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { LLMNodeData } from "@/lib/types";

const GEMINI_MODELS = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
];

function LLMNodeComponent({ id, data }: NodeProps<LLMNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges = useEdges();
  const [showResult, setShowResult] = useState(false);

  const connectedHandles = new Set(
    edges.filter((e) => e.target === id).map((e) => e.targetHandle)
  );

  const isConnected = (handle: string) => connectedHandles.has(handle);

  useEffect(() => {
    if (data.result) setShowResult(true);
  }, [data.result]);

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { model: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleSystemPromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { systemPrompt: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleUserMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { userMessage: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode
      title="Run LLM"
      icon={<Brain size={12} />}
      status={data.status}
      accentColor="#6366f1"
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="system_prompt"
        style={{ left: "20%", top: -6, background: "#6366f1", border: "2px solid #6366f1" }}
        title="System Prompt (text)"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="user_message"
        style={{ left: "50%", top: -6, background: "#6366f1", border: "2px solid #6366f1" }}
        title="User Message (text)"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="images"
        style={{ left: "80%", top: -6, background: "#ec4899", border: "2px solid #ec4899" }}
        title="Images (image)"
      />

      {/* Handle labels */}
      <div className="flex justify-between px-1 text-[9px] text-[#555] mb-1">
        <span>System</span>
        <span>Message</span>
        <span>Images</span>
      </div>

      {/* Model selector */}
      <NodeInput label="Model">
        <div className="relative">
          <select
            className={`${inputClass} appearance-none pr-6`}
            value={data.model ?? "gemini-2.0-flash"}
            onChange={handleModelChange}
          >
            {GEMINI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#888]"
          />
        </div>
      </NodeInput>

      {/* System Prompt */}
      <NodeInput label="System Prompt (optional)" disabled={isConnected("system_prompt")}>
        <textarea
          className={inputClass}
          rows={2}
          placeholder="You are a helpful assistant..."
          value={data.systemPrompt ?? ""}
          onChange={handleSystemPromptChange}
          disabled={isConnected("system_prompt")}
        />
      </NodeInput>

      {/* User Message */}
      <NodeInput label="User Message" disabled={isConnected("user_message")}>
        <textarea
          className={inputClass}
          rows={3}
          placeholder="Enter your prompt..."
          value={data.userMessage ?? ""}
          onChange={handleUserMessageChange}
          disabled={isConnected("user_message")}
        />
      </NodeInput>

      {/* Loading state */}
      {data.status === "running" && (
        <div className="flex items-center gap-2 text-xs text-indigo-400">
          <Loader2 size={12} className="animate-spin" />
          <span>Generating...</span>
        </div>
      )}

      {/* Result display */}
      {data.result && (
        <div className="mt-1">
          <button
            onClick={() => setShowResult(!showResult)}
            className="flex w-full items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
          >
            <ChevronDown
              size={10}
              className={`transition-transform ${showResult ? "rotate-180" : ""}`}
            />
            {showResult ? "Hide" : "Show"} Result
          </button>
          {showResult && (
            <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-2 text-[10px] leading-relaxed text-white/80">
              {data.result}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {data.error && (
        <p className="text-[10px] text-red-400">{data.error}</p>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ bottom: -6, background: "#6366f1", border: "2px solid #6366f1" }}
        title="Text output"
      />
    </BaseNode>
  );
}

export const LLMNode = memo(LLMNodeComponent);
