import type { Metadata } from "next";

import { setBusinessVerifiedAction } from "@/app/(main)/actions";
import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function AdminClientsPage() {
  await requireAdminSession();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      businesses: {
        select: { id: true, name: true, slug: true, verified: true },
      },
    },
  });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold">Clients</h1>
        <p className="text-muted-foreground">All user accounts, plans, and linked listings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account list</CardTitle>
          <CardDescription>{users.length} users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-lg border border-border/70 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="font-medium">{user.name}</p>
                <Badge variant="secondary">{user.role}</Badge>
                <Badge variant="outline">{user.subscriptionTier}</Badge>
                {user.subscriptionStatus && <Badge variant="outline">{user.subscriptionStatus}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">{user.businesses.length} linked listing(s)</p>
              {user.businesses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {user.businesses.map((business) => (
                    <form key={business.id} action={setBusinessVerifiedAction} className="rounded-full border border-border/70 px-2 py-1">
                      <input type="hidden" name="businessId" value={business.id} />
                      <input type="hidden" name="value" value={business.verified ? "false" : "true"} />
                      <div className="flex items-center gap-2">
                        <span>{business.name}</span>
                        <Button type="submit" size="sm" variant={business.verified ? "outline" : "default"}>
                          {business.verified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    </form>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
