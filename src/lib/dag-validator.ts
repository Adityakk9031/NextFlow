import type { WorkflowEdge } from "./types";

/**
 * Detects cycles in the workflow DAG using DFS.
 * Returns true if adding the edge would create a cycle.
 */
export function wouldCreateCycle(
  edges: WorkflowEdge[],
  sourceId: string,
  targetId: string
): boolean {
  // Build adjacency list from existing edges
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)!.push(edge.target);
  }

  // Check if targetId can reach sourceId (which would mean adding source→target creates a cycle)
  const visited = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (nodeId === sourceId) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);

    const neighbors = adj.get(nodeId) ?? [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }
    return false;
  }

  return dfs(targetId);
}

/**
 * Returns a topological ordering of nodes using Kahn's algorithm.
 * Used by the workflow executor to determine execution order.
 */
export function topologicalSort(
  nodeIds: string[],
  edges: WorkflowEdge[]
): string[][] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adj.set(id, []);
  }

  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  // Levels: each level can run in parallel
  const levels: string[][] = [];
  let queue = nodeIds.filter((id) => inDegree.get(id) === 0);

  while (queue.length > 0) {
    levels.push([...queue]);
    const nextQueue: string[] = [];

    for (const nodeId of queue) {
      for (const neighbor of adj.get(nodeId) ?? []) {
        const newDegree = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) nextQueue.push(neighbor);
      }
    }

    queue = nextQueue;
  }

  return levels;
}

/**
 * Validates connection type compatibility between handles.
 */
export type HandleDataType = "text" | "image" | "video" | "number" | "any";

interface HandleMeta {
  nodeType: string;
  handleId: string;
  dataType: HandleDataType;
}

const OUTPUT_TYPES: Record<string, Record<string, HandleDataType>> = {
  text: { output: "text" },
  uploadImage: { output: "image" },
  uploadVideo: { output: "video" },
  llm: { output: "text" },
  cropImage: { output: "image" },
  extractFrame: { output: "image" },
};

const INPUT_TYPES: Record<string, Record<string, HandleDataType>> = {
  llm: {
    system_prompt: "text",
    user_message: "text",
    images: "image",
  },
  cropImage: {
    image_url: "image",
    x_percent: "text",
    y_percent: "text",
    width_percent: "text",
    height_percent: "text",
  },
  extractFrame: {
    video_url: "video",
    timestamp: "text",
  },
};

export function isValidConnection(
  source: HandleMeta,
  target: HandleMeta
): boolean {
  const sourceType = OUTPUT_TYPES[source.nodeType]?.[source.handleId] ?? "any";
  const targetType = INPUT_TYPES[target.nodeType]?.[target.handleId] ?? "any";

  if (sourceType === "any" || targetType === "any") return true;
  return sourceType === targetType;
}
