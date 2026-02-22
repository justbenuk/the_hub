import { ImageResponse } from "next/og";

import { prisma } from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f8f4e8 0%, #e7f4ee 100%)",
          color: "#1f2a20",
          padding: "56px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#2f5d4a" }}>Tamworth Hub</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05 }}>
            {business?.name ?? "Tamworth Business Profile"}
          </div>
          <div style={{ fontSize: 28, color: "#3f4e44" }}>{business?.summary ?? "Discover trusted local businesses in Tamworth."}</div>
        </div>
        <div style={{ fontSize: 24, color: "#2f5d4a" }}>{business?.area ?? "Tamworth, UK"}</div>
      </div>
    ),
    size,
  );
}
