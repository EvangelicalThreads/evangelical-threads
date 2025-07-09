import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthSession() {
  // No req or res passed here in App Router context
  return await getServerSession(authOptions);
}
