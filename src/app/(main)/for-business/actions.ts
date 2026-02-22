"use server";

import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appUrl, getPriceIdForPlan, getStripe } from "@/lib/stripe";

export async function createCheckoutSessionAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const planValue = String(formData.get("plan") || "");
  if (planValue !== "Growth" && planValue !== "TownPartner") {
    redirect("/for-business");
  }

  const stripe = getStripe();

  let customerId = session.user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: { userId: session.user.id },
    });

    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: getPriceIdForPlan(planValue), quantity: 1 }],
    success_url: `${appUrl}/for-business?checkout=success`,
    cancel_url: `${appUrl}/for-business?checkout=cancelled`,
    metadata: {
      userId: session.user.id,
      plan: planValue,
    },
  });

  if (!checkoutSession.url) {
    redirect("/for-business?checkout=error");
  }

  redirect(checkoutSession.url);
}

export async function createBillingPortalAction() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  if (!session.user.stripeCustomerId) {
    redirect("/for-business?portal=unavailable");
  }

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: session.user.stripeCustomerId,
    return_url: `${appUrl}/for-business`,
  });

  redirect(portalSession.url);
}
