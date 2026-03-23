"use client";

import { useCallback, useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import { useParams } from "next/navigation";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { useWorkflowStore } from "@/store/workflow-store";
import type { WorkflowNode, WorkflowEdge } from "@/lib/types";

export default function WorkflowEditorPage() {
  const params = useParams<{ id: string }>();
  const workflowId = params.id;

  const {
    setWorkflowId,
    setWorkflowName,
    loadWorkflow,
    setIsSaving,
    setIsRunning,
    nodes,
    edges,
    workflowName,
    updateNodeData,
  } = useWorkflowStore();

  // Load workflow on mount
  useEffect(() => {
    setWorkflowId(workflowId);

    async function fetchWorkflow() {
      const res = await fetch(`/api/workflows/${workflowId}`);
      if (!res.ok) return;
      const { data } = await res.json();
      setWorkflowName(data.name);
      loadWorkflow(data.nodes as WorkflowNode[], data.edges as WorkflowEdge[]);
    }

    fetchWorkflow();
  }, [workflowId, setWorkflowId, setWorkflowName, loadWorkflow]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName, nodes, edges }),
      });
    } finally {
      setIsSaving(false);
    }
  }, [workflowId, workflowName, nodes, edges, setIsSaving]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);

    // Save first
    await fetch(`/api/workflows/${workflowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: workflowName, nodes, edges }),
    });

    // Set all nodes to idle
    nodes.forEach((n) => updateNodeData(n.id, { status: "idle" }));

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId, scope: "FULL" }),
      });

      if (res.ok) {
        // Poll for node status updates
        await pollNodeStatuses(workflowId, nodes, updateNodeData);
      }
    } finally {
      setIsRunning(false);
    }
  }, [workflowId, workflowName, nodes, edges, setIsRunning, updateNodeData]);

  const handleExport = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ name: workflowName, nodes, edges }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowName, nodes, edges]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string);
          if (json.name) setWorkflowName(json.name);
          if (json.nodes && json.edges) {
            loadWorkflow(json.nodes, json.edges);
          }
        } catch {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    },
    [setWorkflowName, loadWorkflow]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0d0d0d]">
      <CanvasToolbar
        workflowId={workflowId}
        onSave={handleSave}
        onRun={handleRun}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 overflow-hidden">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}

// Poll the history API to update node statuses in real-time
async function pollNodeStatuses(
  workflowId: string,
  nodes: WorkflowNode[],
  updateNodeData: (id: string, data: Partial<WorkflowNode["data"]>) => void
) {
  const maxWait = 120_000; // 2 minutes
  const interval = 2000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise((r) => setTimeout(r, interval));

    const res = await fetch(`/api/history/${workflowId}`);
    if (!res.ok) break;

    const { data: runs } = await res.json();
    const latestRun = runs?.[0];
    if (!latestRun) continue;

    // Update each node's status from its NodeRun
    for (const nodeRun of latestRun.nodeRuns ?? []) {
      const node = nodes.find((n) => n.id === nodeRun.nodeId);
      if (!node) continue;

      const status =
        nodeRun.status === "SUCCESS"
          ? "success"
          : nodeRun.status === "FAILED"
            ? "error"
            : "running";

      const output = nodeRun.outputs?.output;
      const updates: Partial<WorkflowNode["data"]> = { status };

      // Set type-specific output fields
      if (node.type === "llm" && output) {
        Object.assign(updates, { result: output });
      }
      if (node.type === "cropImage" && output) {
        Object.assign(updates, { croppedUrl: output });
      }
      if (node.type === "extractFrame" && output) {
        Object.assign(updates, { frameUrl: output });
      }

      updateNodeData(nodeRun.nodeId, updates);
    }

    // Stop polling when run is complete
    if (
      latestRun.status === "SUCCESS" ||
      latestRun.status === "FAILED" ||
      latestRun.status === "PARTIAL"
    ) {
      break;
    }
  }
}
