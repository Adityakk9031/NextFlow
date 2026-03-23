import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  SAMPLE_WORKFLOW_NAME,
  SAMPLE_NODES,
  SAMPLE_EDGES,
} from "@/lib/sample-workflow";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workflow = await db.workflow.create({
    data: {
      userId,
      name: SAMPLE_WORKFLOW_NAME,
      nodes: SAMPLE_NODES as object[],
      edges: SAMPLE_EDGES as object[],
    },
  });

  return NextResponse.json({ data: workflow }, { status: 201 });
}
