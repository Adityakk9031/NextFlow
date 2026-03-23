"use client";

import { memo, useCallback } from "react";
import { Handle, Position, useEdges, type NodeProps } from "reactflow";
import { Crop, Loader2 } from "lucide-react";
import { BaseNode, NodeInput, inputClass } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { CropImageNodeData } from "@/lib/types";

function CropImageNodeComponent({ id, data }: NodeProps<CropImageNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges = useEdges();

  const connectedHandles = new Set(
    edges.filter((e) => e.target === id).map((e) => e.targetHandle)
  );

  const handleChange = useCallback(
    (field: keyof CropImageNodeData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { [field]: parseFloat(e.target.value) || 0 });
      },
    [id, updateNodeData]
  );

  const numberInputClass = `${inputClass} text-center`;

  return (
    <BaseNode
      title="Crop Image"
      icon={<Crop size={12} />}
      status={data.status}
      accentColor="#10b981"
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="image_url"
        style={{ left: "20%", top: -6, background: "#ec4899", border: "2px solid #ec4899" }}
        title="Image URL"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="x_percent"
        style={{ left: "40%", top: -6, background: "#10b981", border: "2px solid #10b981" }}
        title="X% (0-100)"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="y_percent"
        style={{ left: "55%", top: -6, background: "#10b981", border: "2px solid #10b981" }}
        title="Y% (0-100)"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="width_percent"
        style={{ left: "70%", top: -6, background: "#10b981", border: "2px solid #10b981" }}
        title="Width% (0-100)"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="height_percent"
        style={{ left: "85%", top: -6, background: "#10b981", border: "2px solid #10b981" }}
        title="Height% (0-100)"
      />

      <div className="flex justify-between px-1 text-[9px] text-[#555] mb-1">
        <span>Img</span>
        <span>X%</span>
        <span>Y%</span>
        <span>W%</span>
        <span>H%</span>
      </div>

      {/* Crop parameters */}
      <div className="grid grid-cols-2 gap-2">
        <NodeInput label="X %" disabled={connectedHandles.has("x_percent")}>
          <input
            type="number"
            min={0}
            max={100}
            className={numberInputClass}
            value={data.xPercent ?? 0}
            onChange={handleChange("xPercent")}
            disabled={connectedHandles.has("x_percent")}
          />
        </NodeInput>
        <NodeInput label="Y %" disabled={connectedHandles.has("y_percent")}>
          <input
            type="number"
            min={0}
            max={100}
            className={numberInputClass}
            value={data.yPercent ?? 0}
            onChange={handleChange("yPercent")}
            disabled={connectedHandles.has("y_percent")}
          />
        </NodeInput>
        <NodeInput label="Width %" disabled={connectedHandles.has("width_percent")}>
          <input
            type="number"
            min={1}
            max={100}
            className={numberInputClass}
            value={data.widthPercent ?? 100}
            onChange={handleChange("widthPercent")}
            disabled={connectedHandles.has("width_percent")}
          />
        </NodeInput>
        <NodeInput label="Height %" disabled={connectedHandles.has("height_percent")}>
          <input
            type="number"
            min={1}
            max={100}
            className={numberInputClass}
            value={data.heightPercent ?? 100}
            onChange={handleChange("heightPercent")}
            disabled={connectedHandles.has("height_percent")}
          />
        </NodeInput>
      </div>

      {data.status === "running" && (
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Loader2 size={12} className="animate-spin" />
          <span>Cropping...</span>
        </div>
      )}

      {data.croppedUrl && (
        <div className="mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.croppedUrl}
            alt="Cropped"
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
        style={{ bottom: -6, background: "#10b981", border: "2px solid #10b981" }}
        title="Cropped image URL"
      />
    </BaseNode>
  );
}

export const CropImageNode = memo(CropImageNodeComponent);
