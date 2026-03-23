import { NextResponse, after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { executeWorkflow } from "@/lib/workflow-executor";
import { ExecuteSchema } from "@/lib/types";
import type { WorkflowNode, WorkflowEdge } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ExecuteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: JSON.stringify(parsed.error.issues) }, { status: 400 });
  }

  const { workflowId, scope, selectedNodeIds } = parsed.data;

  const workflow = await db.workflow.findFirst({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const nodes = workflow.nodes as unknown as WorkflowNode[];
  const edges = workflow.edges as unknown as WorkflowEdge[];

  // Create the run record so we have a runId to return immediately
  const workflowRun = await db.workflowRun.create({
    data: {
      workflowId,
      userId,
      status: "RUNNING",
      scope:
        scope !== "FULL"
          ? selectedNodeIds && selectedNodeIds.length === 1
            ? "SINGLE"
            : "PARTIAL"
          : "FULL",
    },
  });

  // Use Next.js `after` to run execution after the response is sent
  // This keeps execution alive on Vercel even after the response is returned
  after(async () => {
    await executeWorkflow({
      workflowId,
      userId,
      nodes,
      edges,
      selectedNodeIds: scope !== "FULL" ? selectedNodeIds : undefined,
      runId: workflowRun.id,
    });
  });

  return NextResponse.json({ data: { runId: workflowRun.id } });
}
