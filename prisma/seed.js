const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@codeclubjusl.in";
  const password = "admin@events2026";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      registrationComplete: true,
      emailVerified: new Date(),
    },
    create: {
      email,
      name: "CodeClub Admin",
      password: hashedPassword,
      role: "ADMIN",
      registrationComplete: true,
      emailVerified: new Date(),
    },
  });

  console.log("Admin seeded successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
