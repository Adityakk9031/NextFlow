"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Type } from "lucide-react";
import { BaseNode, NodeInput, inputClass } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { TextNodeData } from "@/lib/types";

function TextNodeComponent({ id, data }: NodeProps<TextNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode
      title="Text"
      icon={<Type size={12} />}
      status={data.status}
      accentColor="#8b5cf6"
    >
      <NodeInput label="Text Content">
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Enter your text here..."
          value={data.text ?? ""}
          onChange={handleChange}
        />
      </NodeInput>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ bottom: -6, background: "#8b5cf6", border: "2px solid #8b5cf6" }}
        title="Text output"
      />
    </BaseNode>
  );
}

export const TextNode = memo(TextNodeComponent);
