"use client";

import { useActionState } from "react";

import { createPlanInterestAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function PlanInterestForm({ plan }: { plan: string }) {
  const [state, action] = useActionState(createPlanInterestAction, initialFormState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="plan" value={plan} />
      <FormField id={`${plan}-company`} label="Company" error={state.errors?.company?.[0]}>
        <Input id={`${plan}-company`} name="company" required />
      </FormField>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField id={`${plan}-contactName`} label="Name" error={state.errors?.contactName?.[0]}>
          <Input id={`${plan}-contactName`} name="contactName" required />
        </FormField>
        <FormField id={`${plan}-contactEmail`} label="Email" error={state.errors?.contactEmail?.[0]}>
          <Input id={`${plan}-contactEmail`} name="contactEmail" type="email" required />
        </FormField>
      </div>
      <FormField id={`${plan}-notes`} label="Notes" error={state.errors?.notes?.[0]}>
        <Textarea id={`${plan}-notes`} name="notes" className="min-h-20" placeholder="Optional goals, budget, campaign timing..." />
      </FormField>
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label={`Request ${plan} plan`} pendingLabel="Sending..." />
    </form>
  );
}
