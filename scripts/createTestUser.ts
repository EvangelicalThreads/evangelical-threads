const bcrypt = require("bcrypt");
const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("testpassword", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: password,
    },
  });

  console.log("✅ User created:", user);
}

main()
  .catch((e) => {
    console.error("❌ Error creating user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
