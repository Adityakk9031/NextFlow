import { db } from "./db";
import { topologicalSort } from "./dag-validator";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import sharp from "sharp";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type {
  WorkflowNode,
  WorkflowEdge,
  LLMNodeData,
  CropImageNodeData,
  ExtractFrameNodeData,
  TextNodeData,
  UploadImageNodeData,
  UploadVideoNodeData,
} from "./types";

interface ExecutionContext {
  nodeOutputs: Map<string, unknown>;
  workflowRunId: string;
}

function getConnectedInput(
  nodeId: string,
  handleId: string,
  edges: WorkflowEdge[],
  ctx: ExecutionContext
): unknown {
  const edge = edges.find(
    (e) => e.target === nodeId && e.targetHandle === handleId
  );
  if (!edge) return undefined;
  return ctx.nodeOutputs.get(edge.source);
}

function getConnectedImages(
  nodeId: string,
  edges: WorkflowEdge[],
  ctx: ExecutionContext
): string[] {
  return edges
    .filter((e) => e.target === nodeId && e.targetHandle === "images")
    .map((e) => ctx.nodeOutputs.get(e.source))
    .filter((v): v is string => typeof v === "string");
}

// ── Direct Gemini call ────────────────────────────────────────────────────────
async function runLLM(payload: {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
}): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const geminiModel = genAI.getGenerativeModel({
    model: payload.model,
    ...(payload.systemPrompt ? { systemInstruction: payload.systemPrompt } : {}),
  });

  const parts: Part[] = [{ text: payload.userMessage }];

  if (payload.images && payload.images.length > 0) {
    for (const imageUrl of payload.images) {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = response.headers.get("content-type") ?? "image/jpeg";
      parts.push({
        inlineData: {
          data: base64,
          mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        },
      });
    }
  }

  const result = await geminiModel.generateContent({
    contents: [{ role: "user", parts }],
  });
  return result.response.text();
}

// ── Upload to Transloadit ─────────────────────────────────────────────────────
async function uploadToTransloadit(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const key = process.env.TRANSLOADIT_KEY;
  if (!key) throw new Error("TRANSLOADIT_KEY not configured");

  const formData = new FormData();
  formData.append(
    "params",
    JSON.stringify({
      auth: { key },
      steps: {
        export: { use: ":original", robot: "/file/store", result: true },
      },
    })
  );
  formData.append(
    "file",
    new Blob([fileBuffer.buffer as ArrayBuffer], { type: mimeType }),
    filename
  );

  const res = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Transloadit upload failed: ${res.statusText}`);

  const data = await res.json();
  const resultFile =
    data?.results?.export?.[0] ?? data?.results?.[":original"]?.[0];
  if (!resultFile?.ssl_url) {
    throw new Error("Transloadit did not return a file URL");
  }
  return resultFile.ssl_url as string;
}

// ── Crop image via sharp ──────────────────────────────────────────────────────
async function cropImage(payload: {
  imageUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}): Promise<string> {
  const imgRes = await fetch(payload.imageUrl);
  if (!imgRes.ok) throw new Error("Failed to download image");
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  const img = sharp(imgBuffer);
  const { width = 1920, height = 1080 } = await img.metadata();

  const left   = Math.round((payload.xPercent / 100) * width);
  const top    = Math.round((payload.yPercent / 100) * height);
  const cw     = Math.max(1, Math.round((payload.widthPercent / 100) * width));
  const ch     = Math.max(1, Math.round((payload.heightPercent / 100) * height));

  const croppedBuffer = await img
    .extract({ left, top, width: cw, height: ch })
    .jpeg()
    .toBuffer();

  return uploadToTransloadit(croppedBuffer, "cropped.jpg", "image/jpeg");
}

// ── Extract frame via ffmpeg ──────────────────────────────────────────────────
async function extractFrame(payload: {
  videoUrl: string;
  timestamp: number | string;
}): Promise<string> {
  const videoRes = await fetch(payload.videoUrl);
  if (!videoRes.ok) throw new Error("Failed to download video");
  const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

  const inputPath  = join(tmpdir(), `video_${Date.now()}.mp4`);
  const outputPath = join(tmpdir(), `frame_${Date.now()}.jpg`);
  writeFileSync(inputPath, videoBuffer);

  try {
    let seekTime: number;
    if (typeof payload.timestamp === "string" && payload.timestamp.endsWith("%")) {
      const probeOut = execSync(
        `ffprobe -v quiet -print_format json -show_format "${inputPath}"`,
        { encoding: "utf8" }
      );
      const duration = parseFloat(JSON.parse(probeOut)?.format?.duration ?? "60");
      seekTime = Math.round((parseFloat(payload.timestamp) / 100) * duration);
    } else {
      seekTime = Number(payload.timestamp) || 0;
    }

    execSync(
      `ffmpeg -ss ${seekTime} -i "${inputPath}" -frames:v 1 -q:v 2 "${outputPath}" -y`,
      { stdio: "pipe" }
    );

    const frameBuffer = readFileSync(outputPath);
    return uploadToTransloadit(frameBuffer, "frame.jpg", "image/jpeg");
  } finally {
    if (existsSync(inputPath)) unlinkSync(inputPath);
    if (existsSync(outputPath)) unlinkSync(outputPath);
  }
}

// ── Execute a single node ─────────────────────────────────────────────────────
async function executeNode(
  node: WorkflowNode,
  edges: WorkflowEdge[],
  ctx: ExecutionContext
): Promise<unknown> {
  const startedAt = Date.now();

  const nodeRun = await db.nodeRun.create({
    data: {
      runId: ctx.workflowRunId,
      nodeId: node.id,
      nodeType: node.type ?? "unknown",
      status: "RUNNING",
    },
  });

  try {
    let output: unknown;

    switch (node.type) {
      case "text": {
        const data = node.data as TextNodeData;
        output = data.text ?? "";
        break;
      }

      case "uploadImage": {
        const data = node.data as UploadImageNodeData;
        if (!data.imageUrl) throw new Error("No image uploaded");
        output = data.imageUrl;
        break;
      }

      case "uploadVideo": {
        const data = node.data as UploadVideoNodeData;
        if (!data.videoUrl) throw new Error("No video uploaded");
        output = data.videoUrl;
        break;
      }

      case "llm": {
        const data = node.data as LLMNodeData;
        const systemPrompt =
          (getConnectedInput(node.id, "system_prompt", edges, ctx) as string) ??
          data.systemPrompt;
        const userMessage =
          (getConnectedInput(node.id, "user_message", edges, ctx) as string) ??
          data.userMessage ??
          "";
        if (!userMessage) throw new Error("User message is required");

        const images = getConnectedImages(node.id, edges, ctx);

        output = await runLLM({
          model: data.model ?? "gemini-2.0-flash",
          systemPrompt: systemPrompt || undefined,
          userMessage,
          images: images.length > 0 ? images : undefined,
        });
        break;
      }

      case "cropImage": {
        const data = node.data as CropImageNodeData;
        const imageUrl =
          (getConnectedInput(node.id, "image_url", edges, ctx) as string) ??
          data.imageUrl;
        if (!imageUrl) throw new Error("No image URL provided");

        const connectedX = Number(getConnectedInput(node.id, "x_percent", edges, ctx));
        const xPercent = connectedX || (data.xPercent ?? 0);
        const connectedY = Number(getConnectedInput(node.id, "y_percent", edges, ctx));
        const yPercent = connectedY || (data.yPercent ?? 0);
        const connectedW = Number(getConnectedInput(node.id, "width_percent", edges, ctx));
        const widthPercent = connectedW || (data.widthPercent ?? 100);
        const connectedH = Number(getConnectedInput(node.id, "height_percent", edges, ctx));
        const heightPercent = connectedH || (data.heightPercent ?? 100);

        output = await cropImage({ imageUrl, xPercent, yPercent, widthPercent, heightPercent });
        break;
      }

      case "extractFrame": {
        const data = node.data as ExtractFrameNodeData;
        const videoUrl =
          (getConnectedInput(node.id, "video_url", edges, ctx) as string) ??
          data.videoUrl;
        if (!videoUrl) throw new Error("No video URL provided");

        const timestamp =
          (getConnectedInput(node.id, "timestamp", edges, ctx) as number | string) ??
          data.timestamp ??
          0;

        output = await extractFrame({ videoUrl, timestamp });
        break;
      }

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    await db.nodeRun.update({
      where: { id: nodeRun.id },
      data: {
        status: "SUCCESS",
        outputs: { output: output as string },
        duration: Date.now() - startedAt,
      },
    });

    ctx.nodeOutputs.set(node.id, output);
    return output;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    await db.nodeRun.update({
      where: { id: nodeRun.id },
      data: {
        status: "FAILED",
        error: errorMessage,
        duration: Date.now() - startedAt,
      },
    });

    throw err;
  }
}

// ── Main executor ─────────────────────────────────────────────────────────────
export async function executeWorkflow({
  workflowId,
  userId,
  nodes,
  edges,
  selectedNodeIds,
  runId,
}: {
  workflowId: string;
  userId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeIds?: string[];
  runId?: string;
}): Promise<string> {
  const runStartedAt = Date.now();

  const targetNodes = selectedNodeIds
    ? nodes.filter((n) => selectedNodeIds.includes(n.id))
    : nodes;

  const nodeIds = targetNodes.map((n) => n.id);
  const relevantEdges = edges.filter(
    (e) => nodeIds.includes(e.source) && nodeIds.includes(e.target)
  );

  // Use the pre-created run if provided, otherwise create one
  const workflowRun = runId
    ? { id: runId }
    : await db.workflowRun.create({
        data: {
          workflowId,
          userId,
          status: "RUNNING",
          scope: selectedNodeIds
            ? selectedNodeIds.length === 1 ? "SINGLE" : "PARTIAL"
            : "FULL",
        },
      });

  const ctx: ExecutionContext = {
    nodeOutputs: new Map(),
    workflowRunId: workflowRun.id,
  };

  const nodeMap = new Map(targetNodes.map((n) => [n.id, n]));
  const levels = topologicalSort(nodeIds, relevantEdges);

  let overallStatus: "SUCCESS" | "FAILED" | "PARTIAL" = "SUCCESS";
  let failedCount = 0;

  for (const level of levels) {
    const results = await Promise.allSettled(
      level.map((nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) return Promise.resolve(undefined);
        return executeNode(node, relevantEdges, ctx);
      })
    );

    for (const result of results) {
      if (result.status === "rejected") {
        failedCount++;
        console.error("Node execution failed:", result.reason);
      }
    }
  }

  if (failedCount === targetNodes.length) overallStatus = "FAILED";
  else if (failedCount > 0) overallStatus = "PARTIAL";

  await db.workflowRun.update({
    where: { id: workflowRun.id },
    data: { status: overallStatus, duration: Date.now() - runStartedAt },
  });

  return workflowRun.id;
}
