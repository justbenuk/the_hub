"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { clearSession, createSession, getCurrentSession, hashPassword, requireAdminSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FormState } from "@/types";

const signInSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Tell us your name so people can recognise you."),
});

const listingRequestSchema = z.object({
  businessName: z.string().min(2, "Please add your business name."),
  contactName: z.string().min(2, "Please add a contact name."),
  contactEmail: z.email("Please enter a valid email address."),
  contactPhone: z.string().min(7, "Phone number looks too short.").optional().or(z.literal("")),
  website: z.url("Website must be a valid URL.").optional().or(z.literal("")),
  category: z.string().min(2, "Select the nearest category."),
  area: z.string().min(2, "Please add your area in Tamworth."),
  description: z.string().min(30, "Add a little more detail about your business."),
  preferredCallTime: z.string().optional().or(z.literal("")),
});

const listingEditSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(2, "Please add your business name."),
  summary: z.string().min(20, "Summary should be at least 20 characters."),
  description: z.string().min(40, "Please add fuller business details."),
  category: z.string().min(2, "Select a category."),
  phone: z.string().optional().or(z.literal("")),
  email: z.email("Please enter a valid email.").optional().or(z.literal("")),
  website: z.url("Website must be a valid URL.").optional().or(z.literal("")),
  address: z.string().min(5, "Please add an address."),
  postcode: z.string().min(4, "Please add a postcode."),
  area: z.string().min(2, "Please add your area in Tamworth."),
});

const jobSubmissionSchema = z.object({
  title: z.string().min(3, "Job title is required."),
  company: z.string().min(2, "Company name is required."),
  summary: z.string().min(16, "Please provide a short role summary."),
  type: z.string().min(2, "Add a job type."),
  salary: z.string().optional().or(z.literal("")),
  location: z.string().min(2, "Add a location in or near Tamworth."),
  applyUrl: z.url("Apply URL must be valid.").optional().or(z.literal("")),
  contactEmail: z.email("Please enter a valid email address."),
});

const eventSubmissionSchema = z.object({
  title: z.string().min(3, "Event title is required."),
  summary: z.string().min(16, "Please add a short event summary."),
  venue: z.string().min(2, "Venue is required."),
  area: z.string().min(2, "Area is required."),
  startsAt: z.string().min(1, "Start date/time is required."),
  endsAt: z.string().optional().or(z.literal("")),
  price: z.string().optional().or(z.literal("")),
  bookingUrl: z.url("Booking URL must be valid.").optional().or(z.literal("")),
  contactEmail: z.email("Please enter a valid email address."),
});

const newsSubmissionSchema = z.object({
  title: z.string().min(4, "News title is required."),
  summary: z.string().min(16, "Please provide a short summary."),
  body: z.string().min(40, "Add more detail to the news article."),
  source: z.string().min(2, "Source is required."),
  sourceUrl: z.url("Source URL must be valid.").optional().or(z.literal("")),
  area: z.string().min(2, "Area is required."),
  contactEmail: z.email("Please enter a valid email address."),
});

const charitySubmissionSchema = z.object({
  name: z.string().min(2, "Charity name is required."),
  summary: z.string().min(16, "Please add a short summary."),
  mission: z.string().min(24, "Please explain what the charity does."),
  area: z.string().min(2, "Area is required."),
  website: z.url("Website must be a valid URL.").optional().or(z.literal("")),
  email: z.email("Please enter a valid charity email.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  contactEmail: z.email("Please enter a valid email address."),
});

const planInterestSchema = z.object({
  plan: z.string().min(2, "Choose a plan."),
  company: z.string().min(2, "Add a company name."),
  contactName: z.string().min(2, "Add your name."),
  contactEmail: z.email("Please enter a valid email address."),
  notes: z.string().optional().or(z.literal("")),
});

const invalidState = (message: string, errors?: Record<string, string[]>): FormState => ({
  success: false,
  message,
  errors,
});

const optionalValue = (value: string | undefined) => (value && value.trim().length > 0 ? value : null);

export async function signUpAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: candidate.data.email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    return invalidState("An account with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      name: candidate.data.name.trim(),
      email: candidate.data.email.toLowerCase(),
      passwordHash: hashPassword(candidate.data.password),
    },
    select: { id: true },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signInAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  const user = await prisma.user.findUnique({
    where: { email: candidate.data.email.toLowerCase() },
    select: { id: true, passwordHash: true },
  });

  if (!user || !verifyPassword(candidate.data.password, user.passwordHash)) {
    return invalidState("Email or password is not correct.");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}

export async function createListingRequestAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentSession();

  const candidate = listingRequestSchema.safeParse({
    businessName: formData.get("businessName"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    website: formData.get("website"),
    category: formData.get("category"),
    area: formData.get("area"),
    description: formData.get("description"),
    preferredCallTime: formData.get("preferredCallTime"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.businessListingRequest.create({
    data: {
      ...candidate.data,
      contactPhone: optionalValue(candidate.data.contactPhone),
      website: optionalValue(candidate.data.website),
      preferredCallTime: optionalValue(candidate.data.preferredCallTime),
      requesterUserId: session?.user.id ?? null,
    },
  });

  revalidatePath("/businesses");
  revalidatePath("/request-listing");
  revalidatePath("/");

  return {
    success: true,
    message: "Thanks - your listing request has been received. We will review it shortly.",
  };
}

export async function createListingEditRequestAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const candidate = listingEditSchema.safeParse({
    businessId: formData.get("businessId"),
    name: formData.get("name"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    address: formData.get("address"),
    postcode: formData.get("postcode"),
    area: formData.get("area"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  const business = await prisma.business.findUnique({
    where: { id: candidate.data.businessId },
    select: { id: true, ownerUserId: true },
  });

  if (!business || business.ownerUserId !== session.user.id) {
    return invalidState("You can only edit listings that belong to your account.");
  }

  await prisma.businessEditRequest.create({
    data: {
      businessId: business.id,
      ownerUserId: session.user.id,
      name: candidate.data.name,
      summary: candidate.data.summary,
      description: candidate.data.description,
      category: candidate.data.category,
      phone: optionalValue(candidate.data.phone),
      email: optionalValue(candidate.data.email),
      website: optionalValue(candidate.data.website),
      address: candidate.data.address,
      postcode: candidate.data.postcode,
      area: candidate.data.area,
    },
  });

  revalidatePath("/my-listings");
  revalidatePath("/admin/moderation");
  revalidatePath(`/businesses/${candidate.data.businessId}`);

  return {
    success: true,
    message: "Thanks. Your changes are pending approval.",
  };
}

export async function createJobSubmissionAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = jobSubmissionSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    summary: formData.get("summary"),
    type: formData.get("type"),
    salary: formData.get("salary"),
    location: formData.get("location"),
    applyUrl: formData.get("applyUrl"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.jobSubmission.create({
    data: {
      ...candidate.data,
      salary: optionalValue(candidate.data.salary),
      applyUrl: optionalValue(candidate.data.applyUrl),
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Thanks. Your job listing is now pending review." };
}

export async function createEventSubmissionAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = eventSubmissionSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    venue: formData.get("venue"),
    area: formData.get("area"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    price: formData.get("price"),
    bookingUrl: formData.get("bookingUrl"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.eventSubmission.create({
    data: {
      title: candidate.data.title,
      summary: candidate.data.summary,
      venue: candidate.data.venue,
      area: candidate.data.area,
      startsAt: new Date(candidate.data.startsAt),
      endsAt: optionalValue(candidate.data.endsAt) ? new Date(candidate.data.endsAt as string) : null,
      price: optionalValue(candidate.data.price),
      bookingUrl: optionalValue(candidate.data.bookingUrl),
      contactEmail: candidate.data.contactEmail,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Thanks. Your event submission is now pending review." };
}

export async function createNewsSubmissionAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = newsSubmissionSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    source: formData.get("source"),
    sourceUrl: formData.get("sourceUrl"),
    area: formData.get("area"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.newsSubmission.create({
    data: {
      ...candidate.data,
      sourceUrl: optionalValue(candidate.data.sourceUrl),
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Thanks. Your news submission is now pending review." };
}

export async function createCharitySubmissionAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = charitySubmissionSchema.safeParse({
    name: formData.get("name"),
    summary: formData.get("summary"),
    mission: formData.get("mission"),
    area: formData.get("area"),
    website: formData.get("website"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.charitySubmission.create({
    data: {
      ...candidate.data,
      website: optionalValue(candidate.data.website),
      email: optionalValue(candidate.data.email),
      phone: optionalValue(candidate.data.phone),
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Thanks. Your charity submission is now pending review." };
}

export async function approveBusinessRequestAction(formData: FormData) {
  await requireAdminSession();

  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  const request = await prisma.businessListingRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "Pending") return;

  const owner = request.requesterUserId
    ? await prisma.user.findUnique({ where: { id: request.requesterUserId }, select: { id: true } })
    : await prisma.user.findUnique({ where: { email: request.contactEmail.toLowerCase() }, select: { id: true } });

  const slugBase = request.businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  const slug = `${slugBase}-${request.id.slice(-6)}`;

  await prisma.$transaction([
    prisma.business.create({
      data: {
        name: request.businessName,
        slug,
        summary: request.description.slice(0, 160),
        description: request.description,
        category: request.category,
        phone: request.contactPhone,
        email: request.contactEmail,
        website: request.website,
        address: `${request.area}, Tamworth`,
        postcode: "B79",
        area: request.area,
        verified: false,
        ownerUserId: owner?.id ?? null,
      },
    }),
    prisma.businessListingRequest.update({
      where: { id: request.id },
      data: { status: "Approved" },
    }),
  ]);

  revalidatePath("/businesses");
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
  revalidatePath("/my-listings");
}

export async function rejectBusinessRequestAction(formData: FormData) {
  await requireAdminSession();
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  await prisma.businessListingRequest.update({ where: { id: requestId }, data: { status: "Rejected" } });

  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function approveBusinessEditRequestAction(formData: FormData) {
  await requireAdminSession();
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  const request = await prisma.businessEditRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "Pending") return;

  await prisma.$transaction([
    prisma.business.update({
      where: { id: request.businessId },
      data: {
        name: request.name,
        summary: request.summary,
        description: request.description,
        category: request.category,
        phone: request.phone,
        email: request.email,
        website: request.website,
        address: request.address,
        postcode: request.postcode,
        area: request.area,
      },
    }),
    prisma.businessEditRequest.update({ where: { id: request.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/businesses");
  revalidatePath("/my-listings");
  revalidatePath("/admin/moderation");
}

export async function rejectBusinessEditRequestAction(formData: FormData) {
  await requireAdminSession();
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  await prisma.businessEditRequest.update({ where: { id: requestId }, data: { status: "Rejected" } });
  revalidatePath("/my-listings");
  revalidatePath("/admin/moderation");
}

export async function approveJobSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;

  const submission = await prisma.jobSubmission.findUnique({ where: { id: submissionId } });
  if (!submission || submission.status !== "Pending") return;

  const linkedBusiness = await prisma.business.findFirst({
    where: { name: submission.company },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.job.create({
      data: {
        title: submission.title,
        company: submission.company,
        summary: submission.summary,
        type: submission.type,
        salary: submission.salary,
        location: submission.location,
        applyUrl: submission.applyUrl,
        businessId: linkedBusiness?.id ?? null,
      },
    }),
    prisma.jobSubmission.update({ where: { id: submission.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function rejectJobSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;
  await prisma.jobSubmission.update({ where: { id: submissionId }, data: { status: "Rejected" } });
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function approveEventSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;

  const submission = await prisma.eventSubmission.findUnique({ where: { id: submissionId } });
  if (!submission || submission.status !== "Pending") return;

  const linkedBusiness = await prisma.business.findFirst({
    where: { name: submission.venue },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.event.create({
      data: {
        title: submission.title,
        summary: submission.summary,
        venue: submission.venue,
        area: submission.area,
        startsAt: submission.startsAt,
        endsAt: submission.endsAt,
        price: submission.price,
        bookingUrl: submission.bookingUrl,
        businessId: linkedBusiness?.id ?? null,
      },
    }),
    prisma.eventSubmission.update({ where: { id: submission.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function rejectEventSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;
  await prisma.eventSubmission.update({ where: { id: submissionId }, data: { status: "Rejected" } });
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function approveNewsSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;

  const submission = await prisma.newsSubmission.findUnique({ where: { id: submissionId } });
  if (!submission || submission.status !== "Pending") return;

  await prisma.$transaction([
    prisma.newsArticle.create({
      data: {
        title: submission.title,
        summary: submission.summary,
        body: submission.body,
        source: submission.source,
        sourceUrl: submission.sourceUrl,
        area: submission.area,
      },
    }),
    prisma.newsSubmission.update({ where: { id: submission.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/news");
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function rejectNewsSubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;
  await prisma.newsSubmission.update({ where: { id: submissionId }, data: { status: "Rejected" } });
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function approveCharitySubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;

  const submission = await prisma.charitySubmission.findUnique({ where: { id: submissionId } });
  if (!submission || submission.status !== "Pending") return;

  await prisma.$transaction([
    prisma.charity.create({
      data: {
        name: submission.name,
        summary: submission.summary,
        mission: submission.mission,
        area: submission.area,
        website: submission.website,
        email: submission.email,
        phone: submission.phone,
      },
    }),
    prisma.charitySubmission.update({ where: { id: submission.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/charities");
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function rejectCharitySubmissionAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) return;
  await prisma.charitySubmission.update({ where: { id: submissionId }, data: { status: "Rejected" } });
  revalidatePath("/dashboard");
  revalidatePath("/admin/moderation");
}

export async function createPlanInterestAction(_: FormState, formData: FormData): Promise<FormState> {
  const candidate = planInterestSchema.safeParse({
    plan: formData.get("plan"),
    company: formData.get("company"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    notes: formData.get("notes"),
  });

  if (!candidate.success) {
    return invalidState("Please fix the highlighted fields.", candidate.error.flatten().fieldErrors);
  }

  await prisma.planInterest.create({
    data: {
      ...candidate.data,
      notes: optionalValue(candidate.data.notes),
    },
  });

  revalidatePath("/for-business");
  revalidatePath("/admin/analytics");

  return {
    success: true,
    message: "Great. We received your plan request and will contact you shortly.",
  };
}

export async function createBusinessClaimRequestAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const businessId = String(formData.get("businessId") || "");
  const note = optionalValue(String(formData.get("note") || ""));

  if (!businessId) {
    return invalidState("Missing business reference.");
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return invalidState("Business not found.");
  }

  if (business.ownerUserId === session.user.id) {
    return invalidState("This listing is already linked to your account.");
  }

  const existingPending = await prisma.businessClaimRequest.findFirst({
    where: { businessId, userId: session.user.id, status: "Pending" },
    select: { id: true },
  });

  if (existingPending) {
    return invalidState("You already have a pending claim for this business.");
  }

  await prisma.businessClaimRequest.create({
    data: {
      businessId,
      userId: session.user.id,
      note,
    },
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/my-listings");

  return {
    success: true,
    message: "Claim submitted. An admin will review it shortly.",
  };
}

export async function approveBusinessClaimRequestAction(formData: FormData) {
  await requireAdminSession();
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  const request = await prisma.businessClaimRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "Pending") return;

  await prisma.$transaction([
    prisma.business.update({ where: { id: request.businessId }, data: { ownerUserId: request.userId } }),
    prisma.businessClaimRequest.update({ where: { id: request.id }, data: { status: "Approved" } }),
  ]);

  revalidatePath("/admin/moderation");
  revalidatePath("/admin/clients");
  revalidatePath("/my-listings");
}

export async function rejectBusinessClaimRequestAction(formData: FormData) {
  await requireAdminSession();
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;

  await prisma.businessClaimRequest.update({ where: { id: requestId }, data: { status: "Rejected" } });

  revalidatePath("/admin/moderation");
}

export async function setBusinessVerifiedAction(formData: FormData) {
  await requireAdminSession();

  const businessId = String(formData.get("businessId") || "");
  const value = String(formData.get("value") || "false") === "true";
  if (!businessId) return;

  await prisma.business.update({ where: { id: businessId }, data: { verified: value } });

  revalidatePath("/businesses");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/moderation");
}

export async function setJobFeaturedAction(formData: FormData) {
  await requireAdminSession();

  const jobId = String(formData.get("jobId") || "");
  const value = String(formData.get("value") || "false") === "true";
  if (!jobId) return;

  await prisma.job.update({ where: { id: jobId }, data: { manuallyFeatured: value } });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/admin/featured");
  revalidatePath("/admin/analytics");
}

export async function setEventFeaturedAction(formData: FormData) {
  await requireAdminSession();

  const eventId = String(formData.get("eventId") || "");
  const value = String(formData.get("value") || "false") === "true";
  if (!eventId) return;

  await prisma.event.update({ where: { id: eventId }, data: { manuallyFeatured: value } });

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin/featured");
  revalidatePath("/admin/analytics");
}
