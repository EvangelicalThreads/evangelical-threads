// ./src/app/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth/next"; // ✅ Use this path instead!

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
