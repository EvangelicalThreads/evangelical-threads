"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function UserStatus() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100); // Show widget after scrolling down 100px
    };
    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show || status === "loading") return null;

  if (!session) {
    return (
      <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-md p-4 max-w-xs">
        <p>You are not logged in.</p>
        <a href="/login" className="text-blue-600 underline">Log in</a>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-md p-4 max-w-xs flex flex-col items-start">
      <p className="mb-2">Hello, <strong>{session.user.name}</strong></p>
      <button
        onClick={() => signOut()}
        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
      >
        Sign Out
      </button>
    </div>
  );
}
