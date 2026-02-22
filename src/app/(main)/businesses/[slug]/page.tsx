/* eslint-disable react-hooks/purity */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/stripe";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: `${business.name} | Business Directory`,
    description: business.summary,
    alternates: {
      canonical: `/businesses/${business.slug}`,
    },
    openGraph: {
      title: `${business.name} | Tamworth Hub`,
      description: business.summary,
      type: "article",
      url: `${appUrl}/businesses/${business.slug}`,
      images: [`${appUrl}/businesses/${business.slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} | Tamworth Hub`,
      description: business.summary,
      images: [`${appUrl}/businesses/${business.slug}/opengraph-image`],
    },
  };
}

export default async function BusinessDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await getCurrentSession();

  const business = await prisma.business.findUnique({
    where: { slug },
  });

  if (!business) {
    notFound();
  }

  await prisma.businessInteraction.create({
    data: {
      businessId: business.id,
      type: "View",
    },
  });

  const interactions = await prisma.businessInteraction.findMany({
    where: {
      businessId: business.id,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  const views30d = interactions.filter((item) => item.type === "View").length;
  const clicks30d = interactions.filter((item) => item.type !== "View").length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      postalCode: business.postcode,
      addressLocality: business.area,
      addressCountry: "GB",
    },
    url: business.website || undefined,
    email: business.email || undefined,
    telephone: business.phone || undefined,
    areaServed: "Tamworth, UK",
    addressCountry: "GB",
    sameAs: business.website ? [business.website] : undefined,
    mainEntityOfPage: `${appUrl}/businesses/${business.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Business Directory",
        item: `${appUrl}/businesses`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: business.name,
        item: `${appUrl}/businesses/${business.slug}`,
      },
    ],
  };

  return (
    <PageContainer className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold">{business.name}</h1>
          <p className="text-muted-foreground">
            {business.area} - {business.postcode}
          </p>
        </div>
        <Badge variant={business.verified ? "default" : "secondary"}>{business.verified ? "Verified" : "Pending verification"}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>{business.category}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{business.description}</p>
            <p>{business.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Connect directly with this business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {session && business.ownerUserId !== session.user.id && (
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/businesses/${business.slug}/claim`}>Claim this business</Link>
              </Button>
            )}
            {business.website && (
              <Button className="w-full" asChild>
                <Link href={`/go/business/${business.id}?type=website&to=${encodeURIComponent(business.website)}`}>Visit website</Link>
              </Button>
            )}
            {business.email && (
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/go/business/${business.id}?type=contact&to=${encodeURIComponent(`mailto:${business.email}`)}`}>Email business</Link>
              </Button>
            )}
            {business.phone && (
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/go/business/${business.id}?type=contact&to=${encodeURIComponent(`tel:${business.phone}`)}`}>Call {business.phone}</Link>
              </Button>
            )}
            <div className="mt-4 rounded-lg border border-border/70 p-3 text-xs text-muted-foreground">
              <p>{views30d} profile views in 30 days</p>
              <p>{clicks30d} contact clicks in 30 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
