import type { Metadata } from "next";

import { RequestListingForm } from "@/components/forms/RequestListingForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Request business listing",
};

export default function RequestListingPage() {
  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Request to list your business</CardTitle>
            <CardDescription>
              Submit your details and we will review your request for the Tamworth directory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequestListingForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
