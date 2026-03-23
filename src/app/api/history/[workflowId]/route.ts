import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ workflowId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workflowId } = await params;

  const runs = await db.workflowRun.findMany({
    where: { workflowId, userId },
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      nodeRuns: {
        orderBy: { id: "asc" },
      },
    },
  });

  return NextResponse.json({ data: runs });
}
