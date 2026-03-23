"use client";

import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import type { WorkflowEdge, WorkflowNode } from "@/lib/types";
import { wouldCreateCycle } from "@/lib/dag-validator";

interface HistoryEntry {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowStore {
  // Canvas state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];

  // Sidebar state
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;

  // Undo/Redo history
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Workflow meta
  workflowId: string | null;
  workflowName: string;
  isSaving: boolean;
  isRunning: boolean;

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  setWorkflowId: (id: string) => void;
  setWorkflowName: (name: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsRunning: (running: boolean) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  resetCanvas: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  past: [],
  future: [],
  workflowId: null,
  workflowName: "Untitled Workflow",
  isSaving: false,
  isRunning: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const { edges } = get();
    const { source, target } = connection;
    if (!source || !target) return;

    // Prevent cycles
    if (wouldCreateCycle(edges, source, target)) {
      console.warn("Connection would create a cycle — rejected");
      return;
    }

    get().saveHistory();

    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#4f46e5", strokeWidth: 2 },
        },
        state.edges
      ),
    }));
  },

  addNode: (node) => {
    get().saveHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ) as WorkflowNode[],
    }));
  },

  setWorkflowId: (id) => set({ workflowId: id }),
  setWorkflowName: (name) => set({ workflowName: name }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

  saveHistory: () => {
    const { nodes, edges, past } = get();
    set({
      past: [...past.slice(-30), { nodes, edges }],
      future: [],
    });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      past: [...past, { nodes, edges }],
    });
  },

  loadWorkflow: (nodes, edges) => {
    set({ nodes, edges, past: [], future: [] });
  },

  resetCanvas: () => {
    get().saveHistory();
    set({ nodes: [], edges: [] });
  },
}));
