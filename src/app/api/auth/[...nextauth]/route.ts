import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Optional: fallback users array (for quick testing without DB)
// const users = [
//   {
//     id: "cmc6rtrvi0001usl4or5qsb9n",
//     name: "k",
//     email: "katie.pg32@gmail.com",
//     password: "password123", // plaintext only for testing!
//   },
// ];

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Sign in with Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        // Prisma DB lookup
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, password: true, name: true },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };

        // Fallback manual users (uncomment if needed for quick test without DB)
        /*
        const fallbackUser = users.find(
          (u) => u.email === email && password === u.password
        );
        if (fallbackUser) {
          return {
            id: fallbackUser.id,
            email: fallbackUser.email,
            name: fallbackUser.name,
          };
        }
        return null;
        */
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
