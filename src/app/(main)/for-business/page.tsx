import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { createBillingPortalAction, createCheckoutSessionAction } from "@/app/(main)/for-business/actions";
import { PlanInterestForm } from "@/components/forms/PlanInterestForm";
import PageContainer from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "For business",
};

type SearchParams = Promise<{ checkout?: string; portal?: string }>;

export default async function ForBusinessPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getCurrentSession();
  const params = await searchParams;

  return (
    <PageContainer className="py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">For local businesses</h1>
        <p className="max-w-3xl text-muted-foreground">
          Tamworth Hub is built to become the trusted local discovery platform. Start with a listing request,
          then grow through featured placements and sponsored campaigns.
        </p>
        {session?.user.subscriptionTier && session.user.subscriptionTier !== "Free" && (
          <p className="text-sm text-primary">Your active plan: {session.user.subscriptionTier}</p>
        )}
        {params.checkout === "success" && <p className="text-sm text-primary">Checkout complete. Your plan is being activated.</p>}
        {params.checkout === "cancelled" && <p className="text-sm text-muted-foreground">Checkout cancelled.</p>}
        {params.portal === "unavailable" && <p className="text-sm text-muted-foreground">No billing profile found yet.</p>}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <PlanCard
          title="Starter"
          price="Free"
          points={["Directory listing", "Basic business profile", "Standard moderation"]}
          footer={
            <Button variant="outline" asChild>
              <Link href="/request-listing">Start free</Link>
            </Button>
          }
        />
        <PlanCard
          title="Growth"
          price="GBP29/mo"
          points={["Featured directory placement", "Priority moderation", "1 sponsored news slot per month"]}
          footer={
            <form action={createCheckoutSessionAction}>
              <input type="hidden" name="plan" value="Growth" />
              <Button type="submit" className="w-full">
                Upgrade to Growth
              </Button>
            </form>
          }
        />
        <PlanCard
          title="Town Partner"
          price="GBP89/mo"
          points={["Homepage feature opportunities", "Event spotlight", "Dedicated campaign support"]}
          footer={
            <form action={createCheckoutSessionAction}>
              <input type="hidden" name="plan" value="TownPartner" />
              <Button type="submit" className="w-full">
                Upgrade to Partner
              </Button>
            </form>
          }
        />
      </div>

      <div className="mt-6">
        <form action={createBillingPortalAction}>
          <Button variant="outline" type="submit">
            Manage subscription
          </Button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/request-listing">Request your listing</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/submit-news">Submit business news</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Growth plan enquiry</CardTitle>
            <CardDescription>Ideal for businesses that want more visibility and faster lead flow.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanInterestForm plan="Growth" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Town Partner enquiry</CardTitle>
            <CardDescription>For larger campaigns and premium town-wide placement.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanInterestForm plan="Town Partner" />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function PlanCard({
  title,
  price,
  points,
  footer,
}: {
  title: string;
  price: string;
  points: string[];
  footer: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-2xl font-semibold text-foreground">{price}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {points.map((point) => (
          <p key={point}>- {point}</p>
        ))}
        <div className="pt-3">{footer}</div>
      </CardContent>
    </Card>
  );
}
