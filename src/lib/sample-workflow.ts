import type { WorkflowNode, WorkflowEdge } from "./types";

/**
 * Product Marketing Kit Generator
 *
 * Branch A: Text Node (product description) → LLM Node (generate tagline)
 * Branch B: Upload Image Node → Crop Image Node → (image to final LLM)
 * Final LLM: waits for both branches → generates full marketing copy
 *
 * Branches A and B run in parallel via topological sort levels.
 */

export const SAMPLE_WORKFLOW_NAME = "Product Marketing Kit Generator";

export const SAMPLE_NODES: WorkflowNode[] = [
  // Branch A
  {
    id: "text-product-desc",
    type: "text",
    position: { x: 80, y: 80 },
    data: {
      label: "Text",
      status: "idle",
      text: "Our product is a next-generation AI-powered workflow builder that lets teams automate complex LLM pipelines visually.",
    },
  },
  {
    id: "llm-tagline",
    type: "llm",
    position: { x: 80, y: 280 },
    data: {
      label: "Run LLM",
      status: "idle",
      model: "gemini-2.0-flash",
      systemPrompt: "You are a creative marketing copywriter. Generate punchy product taglines.",
      userMessage: "",
    },
  },

  // Branch B
  {
    id: "upload-product-image",
    type: "uploadImage",
    position: { x: 480, y: 80 },
    data: {
      label: "Upload Image",
      status: "idle",
    },
  },
  {
    id: "crop-hero",
    type: "cropImage",
    position: { x: 480, y: 280 },
    data: {
      label: "Crop Image",
      status: "idle",
      xPercent: 10,
      yPercent: 10,
      widthPercent: 80,
      heightPercent: 80,
    },
  },

  // Final merge node
  {
    id: "llm-final-copy",
    type: "llm",
    position: { x: 280, y: 520 },
    data: {
      label: "Run LLM",
      status: "idle",
      model: "gemini-1.5-pro",
      systemPrompt:
        "You are a senior product marketing manager. Create a complete marketing kit including: headline, subheadline, 3 key benefits, and a CTA. Be concise and impactful.",
      userMessage: "",
    },
  },
];

export const SAMPLE_EDGES: WorkflowEdge[] = [
  // Branch A: product desc → tagline LLM
  {
    id: "e1",
    source: "text-product-desc",
    sourceHandle: "output",
    target: "llm-tagline",
    targetHandle: "user_message",
    animated: true,
    style: { stroke: "#4f46e5", strokeWidth: 2 },
  },

  // Branch B: image → crop
  {
    id: "e2",
    source: "upload-product-image",
    sourceHandle: "output",
    target: "crop-hero",
    targetHandle: "image_url",
    animated: true,
    style: { stroke: "#4f46e5", strokeWidth: 2 },
  },

  // Tagline → final LLM user_message
  {
    id: "e3",
    source: "llm-tagline",
    sourceHandle: "output",
    target: "llm-final-copy",
    targetHandle: "user_message",
    animated: true,
    style: { stroke: "#4f46e5", strokeWidth: 2 },
  },

  // Cropped image → final LLM images
  {
    id: "e4",
    source: "crop-hero",
    sourceHandle: "output",
    target: "llm-final-copy",
    targetHandle: "images",
    animated: true,
    style: { stroke: "#4f46e5", strokeWidth: 2 },
  },
];
