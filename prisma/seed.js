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
      description: "**Welcome to the CodeClub JUSL ML Event - Tensor On The Turfs 2026.**\n\nThis tournament consists of two rounds designed to test your core analytical skills and your ability to build intelligent, autonomous agents. Below are the definitive guidelines for both rounds.\n\n==Round 1: Conceptual Screening (Online MCQ)==\n* **Date**: July 13, 2026\n* **Platform**: HackerEarth (Online)\n* **Format**: 30 Multiple Choice Questions (MCQs)\n* **Duration**: 30 minutes\n\n==Round 2: The RL Football Showdown (Advanced Stage)==\n* **Date**: July 15, 2026\n* **Platform**: HackerEarth + Website (Online)\n* **Timing**: Exact schedule and platform links will be communicated directly to shortlisted candidates.\n* **Eligibility**: Open exclusively to top-performing participants from Round 1.\n\n__Participant Details Required for Registration__:\n* **Name** [String]\n* **Gender** [Options: Male / Female / Transgender]\n* **Phone Number**\n* **Email ID**\n* **College/University Name**\n* **Stream** (Engineering, Science, Arts)\n* **Department**",
      rules: [
        "**1. Core Topics & Syllabus:** The question set will evaluate fundamentals across: **Mathematics** (linear algebra, calculus, optimization), **Statistics** (probability, hypothesis testing), **Basic Machine Learning & Reinforcement Learning** (supervised/unsupervised, evaluation metrics, MDPs, policy/value functions), and **Data Analysis** (preprocessing, feature engineering, EDA).",
        "**2. Timeline & Login Window:** The login window opens at **19:30 IST** and closes strictly at **20:00 IST** on July 13, 2026. Your individual 30-minute timer begins the exact moment you click \"Start Test.\" No extra time will be provided if you log in late.",
        "**3. Test Environment & Platform Regulations:** HackerEarth’s automated proctoring will be active. **Do not switch tabs, minimize the browser, or leave the test screen**; any navigation away will result in immediate disqualification. Copy-pasting is disabled.",
        "**4. Scoring Rules:** 30 questions in 30 minutes. Check the HackerEarth welcome screen regarding negative marking before starting.",
        "**5. Round 2: Competition Format:** Shortlisted participants will train a **deep reinforcement learning policy** to control an 11-player football squad. Trained models will deploy head-to-head in automated matches.",
        "**6. Round 2: Core Expectations:** Submissions must be your original code. Plagiarism, sharing questions, or using external AI assistants will result in **permanent blacklisting**."
      ],
      poster: "../events/tensor-on-the-turfs-qr.webp",
      prize: "TBD",
      coordinators: [
        "Debarun Patra [+91-858292252]",
        "Naireet Sadhukhan [+91-9875625835]",
        "Samriddha Banerjee [+91-7596884368]"
      ],
      prelimsDate: [
        "13th July 2026 (Online)"
      ],
      finalsDate: "15th July 2026 (Online)",
      format: "Online",
      registrationCloseTime: new Date("2026-07-13T19:30:00+05:30"),
      registeredMessage: "**HackerEarth Round 1 Link**: https://hackerearth.com/challenges/competitive/tensor-on-the-turfs-2026/\n* Please make sure you are logged in to your HackerEarth account.\n* The test window will open exactly at 19:30 IST."
    },
    create: {
      slug: "tensor-on-the-turf",
      name: "Tensor On The Turfs 2026",
      minMembers: 1,
      maxMembers: 1,
      registrationsOpen: true,
      isLive: true,
      shortDescription: "CodeClub JUSL ML Event: Tensor On The Turfs 2026. A two-round machine learning tournament testing conceptual screening and deep reinforcement learning.",
      description: "**Welcome to the CodeClub JUSL ML Event - Tensor On The Turfs 2026.**\n\nThis tournament consists of two rounds designed to test your core analytical skills and your ability to build intelligent, autonomous agents. Below are the definitive guidelines for both rounds.\n\n==Round 1: Conceptual Screening (Online MCQ)==\n* **Date**: July 13, 2026\n* **Platform**: HackerEarth (Online)\n* **Format**: 30 Multiple Choice Questions (MCQs)\n* **Duration**: 30 minutes\n\n==Round 2: The RL Football Showdown (Advanced Stage)==\n* **Date**: July 15, 2026\n* **Platform**: HackerEarth + Website (Online)\n* **Timing**: Exact schedule and platform links will be communicated directly to shortlisted candidates.\n* **Eligibility**: Open exclusively to top-performing participants from Round 1.\n\n__Participant Details Required for Registration__:\n* **Name** [String]\n* **Gender** [Options: Male / Female / Transgender]\n* **Phone Number**\n* **Email ID**\n* **College/University Name**\n* **Stream** (Engineering, Science, Arts)\n* **Department**",
      rules: [
        "**1. Core Topics & Syllabus:** The question set will evaluate fundamentals across: **Mathematics** (linear algebra, calculus, optimization), **Statistics** (probability, hypothesis testing), **Basic Machine Learning & Reinforcement Learning** (supervised/unsupervised, evaluation metrics, MDPs, policy/value functions), and **Data Analysis** (preprocessing, feature engineering, EDA).",
        "**2. Timeline & Login Window:** The login window opens at **19:30 IST** and closes strictly at **20:00 IST** on July 13, 2026. Your individual 30-minute timer begins the exact moment you click \"Start Test.\" No extra time will be provided if you log in late.",
        "**3. Test Environment & Platform Regulations:** HackerEarth’s automated proctoring will be active. **Do not switch tabs, minimize the browser, or leave the test screen**; any navigation away will result in immediate disqualification. Copy-pasting is disabled.",
        "**4. Scoring Rules:** 30 questions in 30 minutes. Check the HackerEarth welcome screen regarding negative marking before starting.",
        "**5. Round 2: Competition Format:** Shortlisted participants will train a **deep reinforcement learning policy** to control an 11-player football squad. Trained models will deploy head-to-head in automated matches.",
        "**6. Round 2: Core Expectations:** Submissions must be your original code. Plagiarism, sharing questions, or using external AI assistants will result in **permanent blacklisting**."
      ],
      poster: "../events/tensor-on-the-turfs-qr.webp",
      prize: "TBD",
      coordinators: [
        "Debarun Patra [+91-858292252]",
        "Naireet Sadhukhan [+91-9875625835]",
        "Samriddha Banerjee [+91-7596884368]"
      ],
      prelimsDate: [
        "13th July 2026 (Online)"
      ],
      finalsDate: "15th July 2026 (Online)",
      format: "Online",
      registrationCloseTime: new Date("2026-07-13T19:30:00+05:30"),
      registeredMessage: "**HackerEarth Round 1 Link**: https://hackerearth.com/challenges/competitive/tensor-on-the-turfs-2026/\n* Please make sure you are logged in to your HackerEarth account.\n* The test window will open exactly at 19:30 IST."
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
