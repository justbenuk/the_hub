"use client";

import { useActionState } from "react";

import { createEventSubmissionAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function EventSubmissionForm() {
  const [state, action] = useActionState(createEventSubmissionAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="title" label="Event title" error={state.errors?.title?.[0]}>
          <Input id="title" name="title" required />
        </FormField>
        <FormField id="venue" label="Venue" error={state.errors?.venue?.[0]}>
          <Input id="venue" name="venue" required />
        </FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="area" label="Area" error={state.errors?.area?.[0]}>
          <Input id="area" name="area" required />
        </FormField>
        <FormField id="price" label="Price" error={state.errors?.price?.[0]}>
          <Input id="price" name="price" placeholder="Free, GBP10, donation" />
        </FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="startsAt" label="Starts" error={state.errors?.startsAt?.[0]}>
          <Input id="startsAt" name="startsAt" type="datetime-local" required />
        </FormField>
        <FormField id="endsAt" label="Ends" error={state.errors?.endsAt?.[0]}>
          <Input id="endsAt" name="endsAt" type="datetime-local" />
        </FormField>
      </div>
      <FormField id="bookingUrl" label="Booking URL" error={state.errors?.bookingUrl?.[0]}>
        <Input id="bookingUrl" name="bookingUrl" placeholder="https://" />
      </FormField>
      <FormField id="summary" label="Event summary" error={state.errors?.summary?.[0]}>
        <Textarea id="summary" name="summary" className="min-h-24" required />
      </FormField>
      <FormField id="contactEmail" label="Contact email" error={state.errors?.contactEmail?.[0]}>
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </FormField>
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label="Submit event" pendingLabel="Submitting..." />
    </form>
  );
}
