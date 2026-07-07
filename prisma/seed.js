/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env file manually if env variables are not already set (e.g. running seed script directly via Node)
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split(/\r?\n/).forEach((line) => {
        // Match lines like KEY="VALUE" or KEY=VALUE
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          // Strip quotes if they wrap the value
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value.trim();
          }
        }
      });
    }
  } catch (err) {
    console.warn("Notice: Failed to read .env file programmatically:", err.message);
  }
}

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set. Please define them in your .env file."
    );
  }

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

  const event = await prisma.event.upsert({
    where: { slug: "tensor-on-the-turf" },
    update: {
      name: "Tensor On The Turfs 2026",
      minMembers: 1,
      maxMembers: 1,
      registrationsOpen: true,
      isLive: true,
      shortDescription: "CodeClub JUSL ML Event: Tensor On The Turfs 2026. A two-round machine learning tournament testing conceptual screening and deep reinforcement learning.",
      description: "Welcome to the CodeClub JUSL ML Event - Tensor On The Turfs 2026. This tournament consists of two rounds designed to test your core analytical skills and your ability to build intelligent, autonomous agents.\n\nRound 1: Conceptual Screening (Online MCQ)\nDate: July 13, 2026\nPlatform: HackerEarth (Online)\nFormat: 30 Multiple Choice Questions (MCQs)\nDuration: 30 minutes\n\nRound 2: The RL Football Showdown (Advanced Stage)\nDate: July 15, 2026\nPlatform: HackerEarth + Website (Online)\nEligibility: Open exclusively to top-performing participants from Round 1.",
      rules: [
        "Round 1 login window opens at 19:30 IST and closes strictly at 20:00 IST on July 13, 2026.",
        "HackerEarth automated proctoring will be active. Tab switching or browser minimization will lead to disqualification.",
        "Copy-paste restrictions are active and monitored.",
        "Round 2 submissions must be original code.",
        "Plagiarism or use of external AI assistants will result in permanent blacklisting."
      ],
      poster: "../events/tensor on the turfs.png",
      prize: "TBD",
      coordinators: [
        "CodeClub JUSL ML Team Coordinators"
      ],
      prelimsDate: [
        "13th July 2026 (Online)"
      ],
      finalsDate: "15th July 2026 (Online)"
    },
    create: {
      slug: "tensor-on-the-turf",
      name: "Tensor On The Turfs 2026",
      minMembers: 1,
      maxMembers: 1,
      registrationsOpen: true,
      isLive: true,
      shortDescription: "CodeClub JUSL ML Event: Tensor On The Turfs 2026. A two-round machine learning tournament testing conceptual screening and deep reinforcement learning.",
      description: "Welcome to the CodeClub JUSL ML Event - Tensor On The Turfs 2026. This tournament consists of two rounds designed to test your core analytical skills and your ability to build intelligent, autonomous agents.\n\nRound 1: Conceptual Screening (Online MCQ)\nDate: July 13, 2026\nPlatform: HackerEarth (Online)\nFormat: 30 Multiple Choice Questions (MCQs)\nDuration: 30 minutes\n\nRound 2: The RL Football Showdown (Advanced Stage)\nDate: July 15, 2026\nPlatform: HackerEarth + Website (Online)\nEligibility: Open exclusively to top-performing participants from Round 1.",
      rules: [
        "Round 1 login window opens at 19:30 IST and closes strictly at 20:00 IST on July 13, 2026.",
        "HackerEarth automated proctoring will be active. Tab switching or browser minimization will lead to disqualification.",
        "Copy-paste restrictions are active and monitored.",
        "Round 2 submissions must be original code.",
        "Plagiarism or use of external AI assistants will result in permanent blacklisting."
      ],
      poster: "../events/tensor on the turfs.png",
      prize: "TBD",
      coordinators: [
        "CodeClub JUSL ML Team Coordinators"
      ],
      prelimsDate: [
        "13th July 2026 (Online)"
      ],
      finalsDate: "15th July 2026 (Online)"
    }
  });

  console.log("Event seeded successfully:", event.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
