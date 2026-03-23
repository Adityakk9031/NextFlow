"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Type,
  ImageIcon,
  Video,
  Brain,
  Crop,
  Film,
  GripVertical,
} from "lucide-react";
import { useWorkflowStore } from "@/store/workflow-store";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/lib/types";

interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: "text",
    label: "Text",
    description: "Input text or prompt",
    icon: <Type size={14} />,
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.12)",
  },
  {
    type: "uploadImage",
    label: "Upload Image",
    description: "JPG, PNG, WEBP, GIF",
    icon: <ImageIcon size={14} />,
    color: "#f472b6",
    bgColor: "rgba(244,114,182,0.12)",
  },
  {
    type: "uploadVideo",
    label: "Upload Video",
    description: "MP4, MOV, WEBM",
    icon: <Video size={14} />,
    color: "#fbbf24",
    bgColor: "rgba(251,191,36,0.12)",
  },
  {
    type: "llm",
    label: "Run LLM",
    description: "Execute Gemini AI model",
    icon: <Brain size={14} />,
    color: "#818cf8",
    bgColor: "rgba(129,140,248,0.12)",
  },
  {
    type: "cropImage",
    label: "Crop Image",
    description: "Crop image via FFmpeg",
    icon: <Crop size={14} />,
    color: "#34d399",
    bgColor: "rgba(52,211,153,0.12)",
  },
  {
    type: "extractFrame",
    label: "Extract Frame",
    description: "Extract video frame",
    icon: <Film size={14} />,
    color: "#fb923c",
    bgColor: "rgba(251,146,60,0.12)",
  },
];

export function LeftSidebar() {
  const { leftSidebarOpen, toggleLeftSidebar } = useWorkflowStore();
  const [search, setSearch] = useState("");

  const filtered = NODE_DEFINITIONS.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData("nodeType", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-[#1a1a1a] bg-[#0c0c0c] transition-all duration-300",
        leftSidebarOpen ? "w-60" : "w-12"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggleLeftSidebar}
        className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#1e1e1e] bg-[#141414] text-[#555] shadow-lg transition-all hover:border-violet-500/40 hover:text-violet-400"
      >
        {leftSidebarOpen ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
      </button>

      {leftSidebarOpen ? (
        <>
          {/* Header */}
          <div className="border-b border-[#1a1a1a] px-4 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">
              Node Palette
            </p>
          </div>

          {/* Search */}
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] px-2.5 py-2 transition-colors focus-within:border-violet-500/30">
              <Search size={11} className="text-[#444]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nodes..."
                className="flex-1 bg-transparent text-xs text-white placeholder:text-[#444] focus:outline-none"
              />
            </div>
          </div>

          {/* Node list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-widest text-[#3a3a3a]">
              Drag to canvas
            </p>
            <div className="space-y-1">
              {filtered.map((node) => (
                <NodeCard key={node.type} node={node} onDragStart={onDragStart} />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Collapsed icon column */
        <div className="flex flex-col items-center gap-1.5 pt-14">
          {NODE_DEFINITIONS.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              title={node.label}
              className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-[#1e1e1e] transition-all hover:border-[#2a2a2a] active:cursor-grabbing active:scale-95"
              style={{ backgroundColor: node.bgColor, color: node.color }}
            >
              {node.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NodeCard({
  node,
  onDragStart,
}: {
  node: NodeDefinition;
  onDragStart: (e: React.DragEvent, type: NodeType) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node.type)}
      className="group flex cursor-grab items-center gap-2.5 rounded-lg border border-[#1a1a1a] bg-[#0e0e0e] p-2.5 transition-all hover:border-[#252525] hover:bg-[#131313] active:cursor-grabbing active:scale-[0.98]"
    >
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: node.bgColor, color: node.color }}
      >
        {node.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#e0e0e0]">{node.label}</p>
        <p className="truncate text-[10px] text-[#555]">{node.description}</p>
      </div>
      <GripVertical size={12} className="shrink-0 text-[#333] opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
