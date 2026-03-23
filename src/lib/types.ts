import { z } from "zod";
import type { Node, Edge } from "reactflow";

// ─── Node Types ───────────────────────────────────────────────────────────────

export type NodeType =
  | "text"
  | "uploadImage"
  | "uploadVideo"
  | "llm"
  | "cropImage"
  | "extractFrame";

export type NodeStatus = "idle" | "running" | "success" | "error";

export interface BaseNodeData {
  label: string;
  status: NodeStatus;
  output?: unknown;
  error?: string;
}

export interface TextNodeData extends BaseNodeData {
  text: string;
}

export interface UploadImageNodeData extends BaseNodeData {
  imageUrl?: string;
}

export interface UploadVideoNodeData extends BaseNodeData {
  videoUrl?: string;
}

export interface LLMNodeData extends BaseNodeData {
  model: string;
  systemPrompt?: string;
  userMessage?: string;
  result?: string;
}

export interface CropImageNodeData extends BaseNodeData {
  imageUrl?: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  croppedUrl?: string;
}

export interface ExtractFrameNodeData extends BaseNodeData {
  videoUrl?: string;
  timestamp: number | string;
  frameUrl?: string;
}

export type WorkflowNodeData =
  | TextNodeData
  | UploadImageNodeData
  | UploadVideoNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

export type WorkflowNode = Node<WorkflowNodeData, NodeType>;
export type WorkflowEdge = Edge;

// ─── Workflow Schema ──────────────────────────────────────────────────────────

export const WorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export type WorkflowInput = z.infer<typeof WorkflowSchema>;

// ─── Execute Schema ───────────────────────────────────────────────────────────

export const ExecuteSchema = z.object({
  workflowId: z.string().min(1),
  scope: z.enum(["FULL", "PARTIAL", "SINGLE"]).default("FULL"),
  selectedNodeIds: z.array(z.string()).optional(),
});

export type ExecuteInput = z.infer<typeof ExecuteSchema>;

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ─── LLM Task Payload ─────────────────────────────────────────────────────────

export const LLMTaskPayloadSchema = z.object({
  model: z.string(),
  systemPrompt: z.string().optional(),
  userMessage: z.string(),
  images: z.array(z.string()).optional(),
});

export type LLMTaskPayload = z.infer<typeof LLMTaskPayloadSchema>;

// ─── Crop Image Task Payload ──────────────────────────────────────────────────

export const CropImageTaskPayloadSchema = z.object({
  imageUrl: z.string().url(),
  xPercent: z.number().min(0).max(100).default(0),
  yPercent: z.number().min(0).max(100).default(0),
  widthPercent: z.number().min(1).max(100).default(100),
  heightPercent: z.number().min(1).max(100).default(100),
});

export type CropImageTaskPayload = z.infer<typeof CropImageTaskPayloadSchema>;

// ─── Extract Frame Task Payload ───────────────────────────────────────────────

export const ExtractFrameTaskPayloadSchema = z.object({
  videoUrl: z.string().url(),
  timestamp: z.union([z.number(), z.string()]).default(0),
});

export type ExtractFrameTaskPayload = z.infer<typeof ExtractFrameTaskPayloadSchema>;
