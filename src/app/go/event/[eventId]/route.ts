import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const isSafeTarget = (value: string) => value.startsWith("https://") || value.startsWith("http://");

export async function GET(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const target = request.nextUrl.searchParams.get("to") || "";

  if (!target || !isSafeTarget(target)) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  await prisma.eventInteraction.create({ data: { eventId, type: "Click" } });
  return NextResponse.redirect(target);
}
