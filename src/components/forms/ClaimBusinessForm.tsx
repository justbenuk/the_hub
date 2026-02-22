"use client";

import { useActionState } from "react";

import { createBusinessClaimRequestAction } from "@/app/(main)/actions";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function ClaimBusinessForm({ businessId }: { businessId: string }) {
  const [state, action] = useActionState(createBusinessClaimRequestAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="businessId" value={businessId} />
      <Textarea
        name="note"
        className="min-h-24"
        placeholder="Optional: share proof you own/manage this business (website email domain, Companies House info, etc.)"
      />
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label="Submit claim" pendingLabel="Submitting..." />
    </form>
  );
}
