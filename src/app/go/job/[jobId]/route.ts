import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const isSafeTarget = (value: string) => value.startsWith("https://") || value.startsWith("http://");

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const target = request.nextUrl.searchParams.get("to") || "";

  if (!target || !isSafeTarget(target)) {
    return NextResponse.redirect(new URL("/jobs", request.url));
  }

  await prisma.jobInteraction.create({ data: { jobId, type: "Click" } });
  return NextResponse.redirect(target);
}
