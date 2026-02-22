"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction } from "@/app/(main)/actions";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/types";

export function SignUpForm() {
  const [state, action] = useActionState(signUpAction, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="Taylor from Fazeley" required />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@tamworth.co.uk" required />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>

      {state.message && !state.success && <p className="text-sm text-destructive">{state.message}</p>}

      <SubmitButton label="Create account" pendingLabel="Creating account..." className="w-full" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
