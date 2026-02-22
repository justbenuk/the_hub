import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ListingEditForm } from "@/components/forms/ListingEditForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit listing",
};

type Params = Promise<{ businessId: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const { businessId } = await params;

  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerUserId: session.user.id },
    select: {
      id: true,
      name: true,
      summary: true,
      description: true,
      category: true,
      phone: true,
      email: true,
      website: true,
      address: true,
      postcode: true,
      area: true,
    },
  });

  if (!business) {
    redirect("/my-listings");
  }

  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit {business.name}</CardTitle>
            <CardDescription>
              Your updates are sent for moderation and will replace the live listing once approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListingEditForm business={business} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
