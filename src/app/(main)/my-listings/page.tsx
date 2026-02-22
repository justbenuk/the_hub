import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My listings",
};

export default async function MyListingsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const [listings, pendingEdits] = await Promise.all([
    prisma.business.findMany({
      where: { ownerUserId: session.user.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        area: true,
        category: true,
        verified: true,
      },
    }),
    prisma.businessEditRequest.findMany({
      where: { ownerUserId: session.user.id, status: "Pending" },
      orderBy: { createdAt: "desc" },
      select: { id: true, businessId: true },
    }),
  ]);

  const pendingByBusinessId = new Set(pendingEdits.map((item) => item.businessId));

  return (
    <PageContainer className="py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">My listings</h1>
          <p className="text-muted-foreground">Manage your approved directory listings.</p>
        </div>
        <Button asChild>
          <Link href="/request-listing">Request a new listing</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No listings linked to your account</CardTitle>
            <CardDescription>
              Ask an admin to approve your listing request using the same email as your account.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">{listing.category}</Badge>
                  {listing.verified && <Badge>Verified</Badge>}
                  {pendingByBusinessId.has(listing.id) && <Badge variant="outline">Edit pending</Badge>}
                </div>
                <CardTitle>{listing.name}</CardTitle>
                <CardDescription>{listing.area}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/businesses/${listing.slug}`}>View profile</Link>
                </Button>
                <Button asChild>
                  <Link href={`/my-listings/${listing.id}/edit`}>Edit listing</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
