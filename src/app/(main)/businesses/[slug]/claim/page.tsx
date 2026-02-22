import { redirect } from "next/navigation";

import { ClaimBusinessForm } from "@/components/forms/ClaimBusinessForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export default async function ClaimBusinessPage({ params }: { params: Params }) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug }, select: { id: true, name: true, ownerUserId: true } });

  if (!business) {
    redirect("/businesses");
  }

  if (business.ownerUserId === session.user.id) {
    redirect("/my-listings");
  }

  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Claim {business.name}</CardTitle>
            <CardDescription>
              Submit a claim to link this listing to your account. Admin review is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClaimBusinessForm businessId={business.id} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
