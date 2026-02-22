import type { Metadata } from "next";

import { SignUpForm } from "@/components/forms/SignUpForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <PageContainer className="py-16">
      <div className="mx-auto max-w-md animate-rise-in">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create your Tamworth Hub account</CardTitle>
            <CardDescription>Join local businesses, charities, and residents building momentum together.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
