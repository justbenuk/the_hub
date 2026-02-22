import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Charities",
};

type SearchParams = Promise<{ q?: string; area?: string }>;

export default async function CharitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const area = params.area?.trim() ?? "";

  const charities = await prisma.charity.findMany({
    where: {
      ...(q
        ? { OR: [{ name: { contains: q } }, { summary: { contains: q } }, { mission: { contains: q } }] }
        : {}),
      ...(area ? { area: { contains: area } } : {}),
    },
    orderBy: { name: "asc" },
  });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Tamworth charities</h1>
          <p className="text-muted-foreground">Find local organisations making a difference in the community.</p>
        </div>
        <Button asChild>
          <Link href="/submit-charity">Submit a charity</Link>
        </Button>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 md:grid-cols-[2fr_1fr_auto]">
        <Input name="q" placeholder="Search charity or support type" defaultValue={q} />
        <Input name="area" placeholder="Area" defaultValue={area} />
        <div className="flex items-center gap-2">
          <Button type="submit">Filter</Button>
          <Button variant="outline" asChild>
            <Link href="/charities">Reset</Link>
          </Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {charities.map((charity) => (
          <Card key={charity.id}>
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                {charity.area}
              </Badge>
              <CardTitle>{charity.name}</CardTitle>
              <CardDescription>{charity.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{charity.mission}</p>
              {charity.website && (
                <a className="text-primary underline underline-offset-4" href={charity.website} target="_blank" rel="noreferrer">
                  Visit website
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
