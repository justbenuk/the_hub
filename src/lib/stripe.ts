import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
};

export const getPriceIdForPlan = (plan: "Growth" | "TownPartner") => {
  if (plan === "Growth") {
    const priceId = process.env.STRIPE_PRICE_GROWTH;
    if (!priceId) {
      throw new Error("STRIPE_PRICE_GROWTH is not configured.");
    }
    return priceId;
  }

  const priceId = process.env.STRIPE_PRICE_PARTNER;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_PARTNER is not configured.");
  }
  return priceId;
};

export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
