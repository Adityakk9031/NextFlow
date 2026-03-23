"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Video, Upload, X } from "lucide-react";
import { BaseNode, NodeInput } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflow-store";
import type { UploadVideoNodeData } from "@/lib/types";

const TRANSLOADIT_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_KEY ?? "";

async function uploadVideoViaTransloadit(file: File): Promise<string> {
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

function UploadVideoNodeComponent({ id, data }: NodeProps<UploadVideoNodeData>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      updateNodeData(id, { status: "running" });
      try {
        const url = await uploadVideoViaTransloadit(file);
        updateNodeData(id, { videoUrl: url, status: "success", output: url });
      } catch {
        updateNodeData(id, { status: "error", error: "Upload failed" });
      }
    },
    [id, updateNodeData]
  );

  const clearVideo = useCallback(() => {
    updateNodeData(id, { videoUrl: undefined, status: "idle", output: undefined });
    if (inputRef.current) inputRef.current.value = "";
  }, [id, updateNodeData]);

  return (
    <BaseNode
      title="Upload Video"
      icon={<Video size={12} />}
      status={data.status}
      accentColor="#f59e0b"
    >
      <NodeInput label="Video File">
        {data.videoUrl ? (
          <div className="relative">
            <video
              src={data.videoUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "140px" }}
            />
            <button
              onClick={clearVideo}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-[#3a3a3a] py-4 text-center text-xs text-[#666] transition-colors hover:border-amber-500/40 hover:text-amber-400"
          >
            <Upload size={16} />
            <span>Click to upload video</span>
            <span className="text-[10px] text-[#444]">MP4, MOV, WEBM, M4V</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
          className="hidden"
          onChange={handleFileChange}
        />
      </NodeInput>

      {data.error && <p className="text-[10px] text-red-400">{data.error}</p>}

      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ bottom: -6, background: "#f59e0b", border: "2px solid #f59e0b" }}
        title="Video URL output"
      />
    </BaseNode>
  );
}

export const UploadVideoNode = memo(UploadVideoNodeComponent);
