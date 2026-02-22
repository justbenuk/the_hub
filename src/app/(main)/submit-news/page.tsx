import type { Metadata } from "next";

import { NewsSubmissionForm } from "@/components/forms/NewsSubmissionForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit news",
};

export default function SubmitNewsPage() {
  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Submit local news</CardTitle>
            <CardDescription>Add verified local stories relevant to Tamworth residents.</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsSubmissionForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
