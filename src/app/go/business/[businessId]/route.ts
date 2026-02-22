import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const isSafeTarget = (value: string) =>
  value.startsWith("https://") || value.startsWith("http://") || value.startsWith("mailto:") || value.startsWith("tel:");

export async function GET(request: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const target = request.nextUrl.searchParams.get("to") || "";
  const rawType = request.nextUrl.searchParams.get("type");
  const interactionType = rawType === "contact" ? "ContactClick" : "WebsiteClick";

  if (!target || !isSafeTarget(target)) {
    return NextResponse.redirect(new URL("/businesses", request.url));
  }

  await prisma.businessInteraction.create({
    data: {
      businessId,
      type: interactionType,
    },
  });

  return NextResponse.redirect(target);
}
