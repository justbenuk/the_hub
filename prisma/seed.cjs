/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function main() {
  const [
    businessCount,
    jobCount,
    eventCount,
    newsCount,
    charityCount,
    requestCount,
    jobSubmissionCount,
    eventSubmissionCount,
    newsSubmissionCount,
    charitySubmissionCount,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.job.count(),
    prisma.event.count(),
    prisma.newsArticle.count(),
    prisma.charity.count(),
    prisma.businessListingRequest.count(),
    prisma.jobSubmission.count(),
    prisma.eventSubmission.count(),
    prisma.newsSubmission.count(),
    prisma.charitySubmission.count(),
  ]);

  if (businessCount === 0) {
    await prisma.business.createMany({
      data: [
        {
          name: "Ankerside Books",
          slug: "ankerside-books",
          summary: "Independent bookshop focused on local authors and family events.",
          description: "A welcoming independent store with reading clubs and children sessions.",
          category: "Retail",
          phone: "01827 100210",
          email: "hello@ankersidebooks.co.uk",
          website: "https://example.com/ankerside-books",
          address: "14 Market Street",
          postcode: "B79 7LR",
          area: "Town Centre",
          verified: true,
        },
        {
          name: "Two Rivers Wellness",
          slug: "two-rivers-wellness",
          summary: "Physio and wellbeing services for all ages.",
          description: "Sports therapy, rehabilitation, and general wellbeing consultations.",
          category: "Health and wellbeing",
          phone: "01827 100611",
          email: "bookings@tworiverswellness.co.uk",
          website: "https://example.com/two-rivers-wellness",
          address: "8 Ventura Park Road",
          postcode: "B78 3JD",
          area: "Ventura",
          verified: true,
        },
        {
          name: "Glascote Home Repairs",
          slug: "glascote-home-repairs",
          summary: "Reliable local trade support for repairs and maintenance.",
          description: "Domestic plumbing, joinery, and callout maintenance services.",
          category: "Trades",
          phone: "01827 400725",
          address: "22 Silverlink Road",
          postcode: "B77 2EA",
          area: "Glascote",
        },
      ],
    });
  }

  if (jobCount === 0) {
    await prisma.job.createMany({
      data: [
        {
          title: "Customer Advisor",
          company: "Tamworth Co-op Store",
          summary: "Part-time front-of-house role supporting local shoppers.",
          type: "Part-time",
          salary: "GBP 12.40 per hour",
          location: "Tamworth Town Centre",
          applyUrl: "https://example.com/jobs/customer-advisor",
        },
        {
          title: "Warehouse Team Member",
          company: "Midlands Distribution Hub",
          summary: "Evening shift role with training and progression.",
          type: "Full-time",
          salary: "GBP 27,000 per year",
          location: "Wilnecote",
          applyUrl: "https://example.com/jobs/warehouse-team-member",
        },
      ],
    });
  }

  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Tamworth Saturday Makers Market",
          summary: "Local crafts, food, and music in the town centre.",
          venue: "St Editha's Square",
          area: "Town Centre",
          startsAt: new Date("2026-03-07T10:00:00.000Z"),
          endsAt: new Date("2026-03-07T15:00:00.000Z"),
          price: "Free",
        },
        {
          title: "Family Sports Day",
          summary: "Community games and activities for all ages.",
          venue: "Castle Grounds",
          area: "Castle",
          startsAt: new Date("2026-03-14T09:30:00.000Z"),
          endsAt: new Date("2026-03-14T13:00:00.000Z"),
          price: "Free",
        },
      ],
    });
  }

  if (newsCount === 0) {
    await prisma.newsArticle.createMany({
      data: [
        {
          title: "Town centre evening bus timetable expanded",
          summary: "Additional services now running through peak evening periods.",
          body: "Local operators have confirmed an expanded evening timetable with more frequent links to key neighbourhoods.",
          source: "Tamworth Transport Update",
          sourceUrl: "https://example.com/news/evening-bus-timetable",
          area: "Town Centre",
        },
        {
          title: "New apprenticeship support event announced",
          summary: "Employers and colleges are hosting a skills open day next month.",
          body: "The open day will include employer stands, CV guidance, and direct apprenticeship sign-up opportunities.",
          source: "Tamworth Skills Partnership",
          sourceUrl: "https://example.com/news/apprenticeship-open-day",
          area: "Tamworth",
        },
      ],
    });
  }

  if (charityCount === 0) {
    await prisma.charity.createMany({
      data: [
        {
          name: "Tamworth Food Share",
          summary: "Emergency food and household support for local families.",
          mission: "Reducing food insecurity through practical and dignified support.",
          area: "Tamworth",
          website: "https://example.com/charities/food-share",
        },
        {
          name: "Belgrave Youth Futures",
          summary: "After-school programmes and mentorship for young people.",
          mission: "Helping young residents build confidence, skills, and opportunities.",
          area: "Belgrave",
          website: "https://example.com/charities/youth-futures",
        },
      ],
    });
  }

  if (requestCount === 0) {
    await prisma.businessListingRequest.create({
      data: {
        businessName: "Castle Street Coffee",
        contactName: "Jordan Lee",
        contactEmail: "hello@castlestreetcoffee.co.uk",
        category: "Hospitality",
        area: "Town Centre",
        description: "Independent coffee shop focused on local roasters and weekend community sessions.",
      },
    });
  }

  if (jobSubmissionCount === 0) {
    await prisma.jobSubmission.create({
      data: {
        title: "Apprentice Chef",
        company: "Riverside Kitchen",
        summary: "Entry-level kitchen role with paid training.",
        type: "Full-time",
        location: "Tamworth",
        contactEmail: "careers@riversidekitchen.co.uk",
      },
    });
  }

  if (eventSubmissionCount === 0) {
    await prisma.eventSubmission.create({
      data: {
        title: "Community Litter Pick",
        summary: "Volunteer clean-up morning for local parks and lanes.",
        venue: "Castle Grounds",
        area: "Castle",
        startsAt: new Date("2026-04-04T08:30:00.000Z"),
        contactEmail: "volunteers@tamworthgreen.org",
      },
    });
  }

  if (newsSubmissionCount === 0) {
    await prisma.newsSubmission.create({
      data: {
        title: "New startup support workshops announced",
        summary: "Free sessions planned for first-time founders.",
        body: "A new series of practical workshops will run monthly to support startup founders in Tamworth.",
        source: "Tamworth Enterprise Group",
        area: "Tamworth",
        contactEmail: "team@tamworthenterprise.org",
      },
    });
  }

  if (charitySubmissionCount === 0) {
    await prisma.charitySubmission.create({
      data: {
        name: "Warm Homes Tamworth",
        summary: "Support for residents facing fuel poverty.",
        mission: "Providing practical guidance, grants support, and emergency referral routes.",
        area: "Tamworth",
        contactEmail: "hello@warmhomestamworth.org",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
