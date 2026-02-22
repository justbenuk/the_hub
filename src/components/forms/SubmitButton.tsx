"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({ label, pendingLabel = "Working...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
