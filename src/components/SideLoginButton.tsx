'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function SideLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <button
        onClick={() => signIn("credentials", { callbackUrl: "/" })}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 rotate-[-90deg] origin-right bg-[#D4AF37] text-white text-sm px-4 py-2 rounded-tl-lg rounded-bl-lg shadow-lg hover:bg-yellow-600 transition z-50"

      >
        Log In
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-black text-white font-semibold py-3 px-5 rounded-l-lg shadow-lg hover:bg-gray-800 transition z-50"
    >
      Sign Out
    </button>
  );
}
