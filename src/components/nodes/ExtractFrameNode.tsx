"use client";

import { memo, useCallback } from "react";
import { Handle, Position, useEdges, type NodeProps } from "reactflow";
import { Film, Loader2 } from "lucide-react";
import { BaseNode, NodeInput, inputClass } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { ExtractFrameNodeData } from "@/lib/types";

function ExtractFrameNodeComponent({ id, data }: NodeProps<ExtractFrameNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges = useEdges();

  const connectedHandles = new Set(
    edges.filter((e) => e.target === id).map((e) => e.targetHandle)
  );

  const handleTimestampChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { timestamp: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode
      title="Extract Frame"
      icon={<Film size={12} />}
      status={data.status}
      accentColor="#f97316"
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="video_url"
        style={{ left: "30%", top: -6, background: "#f59e0b", border: "2px solid #f59e0b" }}
        title="Video URL"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="timestamp"
        style={{ left: "70%", top: -6, background: "#f97316", border: "2px solid #f97316" }}
        title="Timestamp (seconds or 50%)"
      />

      <div className="flex justify-between px-8 text-[9px] text-[#555] mb-1">
        <span>Video</span>
        <span>Time</span>
      </div>

      <NodeInput
        label="Timestamp (seconds or 50%)"
        disabled={connectedHandles.has("timestamp")}
      >
        <input
          type="text"
          className={inputClass}
          placeholder="0 or 50%"
          value={String(data.timestamp ?? 0)}
          onChange={handleTimestampChange}
          disabled={connectedHandles.has("timestamp")}
        />
      </NodeInput>

      {data.status === "running" && (
        <div className="flex items-center gap-2 text-xs text-orange-400">
          <Loader2 size={12} className="animate-spin" />
          <span>Extracting frame...</span>
        </div>
      )}

      {data.frameUrl && (
        <div className="mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.frameUrl}
            alt="Extracted frame"
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: "100px" }}
          />
        </div>
      )}

      {data.error && <p className="text-[10px] text-red-400">{data.error}</p>}

      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ bottom: -6, background: "#f97316", border: "2px solid #f97316" }}
        title="Extracted frame image URL"
      />
    </BaseNode>
  );
}

export const ExtractFrameNode = memo(ExtractFrameNodeComponent);
