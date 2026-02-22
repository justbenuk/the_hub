import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const mapPlanToTier = (plan: string | null | undefined) => {
  if (plan === "Growth") return "Growth" as const;
  if (plan === "TownPartner") return "TownPartner" as const;
  return "Free" as const;
};

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const rawBody = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = typeof session.customer === "string" ? session.customer : null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && customerId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: "active",
          subscriptionTier: mapPlanToTier(plan),
        },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
    if (customerId) {
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          ...(isActive ? {} : { subscriptionTier: "Free" }),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
