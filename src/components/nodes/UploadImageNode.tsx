"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { ImageIcon, Upload, X } from "lucide-react";
import { BaseNode, NodeInput } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { UploadImageNodeData } from "@/lib/types";

const TRANSLOADIT_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_KEY ?? "";

async function uploadViaTransloadit(file: File): Promise<string> {
  const formData = new FormData();
  const params = JSON.stringify({
    auth: { key: TRANSLOADIT_KEY },
    steps: {
      ":original": { robot: "/upload/handle" },
    },
  });
  formData.append("params", params);
  formData.append("file", file);

  const res = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const result = data?.results?.[":original"]?.[0];
  if (!result?.ssl_url) throw new Error("Upload failed");
  return result.ssl_url as string;
}

function UploadImageNodeComponent({ id, data }: NodeProps<UploadImageNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      updateNodeData(id, { status: "running" });
      try {
        const url = await uploadViaTransloadit(file);
        updateNodeData(id, { imageUrl: url, status: "success", output: url });
      } catch {
        updateNodeData(id, { status: "error", error: "Upload failed" });
      }
    },
    [id, updateNodeData]
  );

  const clearImage = useCallback(() => {
    updateNodeData(id, { imageUrl: undefined, status: "idle", output: undefined });
    if (inputRef.current) inputRef.current.value = "";
  }, [id, updateNodeData]);

  return (
    <BaseNode
      title="Upload Image"
      icon={<ImageIcon size={12} />}
      status={data.status}
      accentColor="#ec4899"
    >
      <NodeInput label="Image File">
        {data.imageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt="Uploaded"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: "140px" }}
            />
            <button
              onClick={clearImage}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-[#3a3a3a] py-4 text-center text-xs text-[#666] transition-colors hover:border-pink-500/40 hover:text-pink-400"
          >
            <Upload size={16} />
            <span>Click to upload image</span>
            <span className="text-[10px] text-[#444]">JPG, PNG, WEBP, GIF</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </NodeInput>

      {data.error && (
        <p className="text-[10px] text-red-400">{data.error}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ bottom: -6, background: "#ec4899", border: "2px solid #ec4899" }}
        title="Image URL output"
      />
    </BaseNode>
  );
}

export const UploadImageNode = memo(UploadImageNodeComponent);
