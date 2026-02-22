import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "News",
};

type SearchParams = Promise<{ q?: string; area?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const area = params.area?.trim() ?? "";

  const articles = await prisma.newsArticle.findMany({
    where: {
      ...(q
        ? { OR: [{ title: { contains: q } }, { summary: { contains: q } }, { body: { contains: q } }] }
        : {}),
      ...(area ? { area: { contains: area } } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Tamworth area news</h1>
          <p className="text-muted-foreground">Important local updates, notices, and community reporting.</p>
        </div>
        <Button asChild>
          <Link href="/submit-news">Submit news</Link>
        </Button>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 md:grid-cols-[2fr_1fr_auto]">
        <Input name="q" placeholder="Search headlines or topics" defaultValue={q} />
        <Input name="area" placeholder="Area" defaultValue={area} />
        <div className="flex items-center gap-2">
          <Button type="submit">Filter</Button>
          <Button variant="outline" asChild>
            <Link href="/news">Reset</Link>
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{article.area}</Badge>
                <Badge variant="outline">{article.publishedAt.toLocaleDateString("en-GB")}</Badge>
              </div>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{article.body}</p>
              <p>Source: {article.source}</p>
              {article.sourceUrl && (
                <a className="text-primary underline underline-offset-4" href={article.sourceUrl} target="_blank" rel="noreferrer">
                  Read source
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
