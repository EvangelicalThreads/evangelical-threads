import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "@/lib/resend"; // assumes you created this

export async function POST(req: Request) {
  const { email, password, name, emailOptIn } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const dataToCreate = {
    email,
    password: hashedPassword,
    name,
    emailOptIn: Boolean(emailOptIn),
  };

  console.log("Creating user with data:", dataToCreate);

  const user = await prisma.user.create({ data: dataToCreate });

  if (emailOptIn) {
    try {
      await sendWelcomeEmail(email, name);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
