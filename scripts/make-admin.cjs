/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run make:admin -- you@example.com");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function main() {
  const result = await prisma.user.updateMany({
    where: { email: email.toLowerCase() },
    data: { role: "Admin" },
  });

  if (result.count === 0) {
    console.error(`No user found for ${email}. Create the account first.`);
    process.exit(1);
  }

  console.log(`Updated ${email} to Admin.`);
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
