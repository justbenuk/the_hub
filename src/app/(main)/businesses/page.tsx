import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Business directory",
};

type SearchParams = Promise<{ q?: string; area?: string; category?: string }>;

export default async function BusinessesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const area = params.area?.trim() ?? "";
  const category = params.category?.trim() ?? "";

  const [businesses, categories] = await Promise.all([
    prisma.business.findMany({
      where: {
        ...(q
          ? {
              OR: [{ name: { contains: q } }, { summary: { contains: q } }, { description: { contains: q } }],
            }
          : {}),
        ...(area ? { area: { contains: area } } : {}),
        ...(category ? { category: { equals: category } } : {}),
      },
      include: {
        owner: {
          select: {
            subscriptionTier: true,
          },
        },
      },
      orderBy: [{ verified: "desc" }, { name: "asc" }],
    }),
    prisma.business.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);

  const sortedBusinesses = businesses.sort((a, b) => {
    const score = (tier: "Free" | "Growth" | "TownPartner" | null | undefined) =>
      tier === "TownPartner" ? 2 : tier === "Growth" ? 1 : 0;
    return score(b.owner?.subscriptionTier) - score(a.owner?.subscriptionTier);
  });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold">Tamworth business directory</h1>
        <p className="text-muted-foreground">Trusted local businesses, services, and independent shops.</p>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
        <Input name="q" placeholder="Search business or service" defaultValue={q} />
        <Input name="area" placeholder="Area" defaultValue={area} />
        <select
          name="category"
          defaultValue={category}
          className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.category} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Button type="submit">Filter</Button>
          <Button variant="outline" asChild>
            <Link href="/businesses">Reset</Link>
          </Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedBusinesses.map((business) => (
          <Card key={business.id}>
            <CardHeader>
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="secondary">{business.category}</Badge>
                <div className="flex gap-2">
                  {business.owner?.subscriptionTier && business.owner.subscriptionTier !== "Free" && (
                    <Badge>{business.owner.subscriptionTier === "TownPartner" ? "Partner featured" : "Featured"}</Badge>
                  )}
                  {business.verified && <Badge variant="outline">Verified</Badge>}
                </div>
              </div>
              <CardTitle>{business.name}</CardTitle>
              <CardDescription>
                {business.area} - {business.postcode}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{business.summary}</p>
              <p>{business.address}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/businesses/${business.slug}`}>View profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
