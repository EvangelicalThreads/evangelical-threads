import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import type { Session } from "next-auth";

export const getAuthSession = async (): Promise<Session | null> => {
  return await getServerSession(authOptions);
};
