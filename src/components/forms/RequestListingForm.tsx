"use client";

import { useActionState } from "react";

import { createListingRequestAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

const categories = ["Retail", "Hospitality", "Trades", "Professional services", "Health and wellbeing", "Other"];

export function RequestListingForm() {
  const [state, action] = useActionState(createListingRequestAction, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="businessName" label="Business name" error={state.errors?.businessName?.[0]}>
          <Input id="businessName" name="businessName" required />
        </FormField>
        <FormField id="category" label="Category" error={state.errors?.category?.[0]}>
          <select
            id="category"
            name="category"
            className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
            defaultValue="Retail"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="contactName" label="Contact name" error={state.errors?.contactName?.[0]}>
          <Input id="contactName" name="contactName" required />
        </FormField>
        <FormField id="contactEmail" label="Contact email" error={state.errors?.contactEmail?.[0]}>
          <Input id="contactEmail" name="contactEmail" type="email" required />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="contactPhone" label="Contact phone" error={state.errors?.contactPhone?.[0]}>
          <Input id="contactPhone" name="contactPhone" placeholder="Optional" />
        </FormField>
        <FormField id="website" label="Website" error={state.errors?.website?.[0]}>
          <Input id="website" name="website" placeholder="https://" />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="area" label="Area in Tamworth" error={state.errors?.area?.[0]}>
          <Input id="area" name="area" placeholder="Amington, Belgrave, Town Centre..." required />
        </FormField>
        <FormField id="preferredCallTime" label="Preferred call time" error={state.errors?.preferredCallTime?.[0]}>
          <Input id="preferredCallTime" name="preferredCallTime" placeholder="Optional" />
        </FormField>
      </div>

      <FormField id="description" label="Business description" error={state.errors?.description?.[0]}>
        <Textarea id="description" name="description" className="min-h-28" required />
      </FormField>

      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}

      <SubmitButton label="Submit listing request" pendingLabel="Submitting..." />
    </form>
  );
}
