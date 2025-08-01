"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Spinner for loading UI
function Spinner() {
  return (
    <div className="flex justify-center items-center mt-20">
      <svg
        className="animate-spin h-10 w-10 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

const validShirtCodes = Array.from({ length: 36 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  return `7-30-25-${num}`;
});

const shirtImageSrc = "/products/70x7-back.png";
const shirtDisplayName = "Seventy Times Seven";

export default function PurchasedPage() {
  const { shirtCode } = useParams() as { shirtCode: string | undefined };
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to login with the correct redirect URL (no /app)
      router.replace(`/login?redirect=/qr/${shirtCode}/purchased`);
    }
  }, [status, router, shirtCode]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (!session?.user) {
    return (
      <p className="text-center mt-20 text-red-500">Redirecting to login...</p>
    );
  }

  if (!shirtCode || !validShirtCodes.includes(shirtCode)) {
    return (
      <div className="max-w-xl mx-auto p-8 font-sans text-gray-900 text-center">
        <p className="text-red-500 mb-6">
          Invalid shirt code or shirt data not found.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const shirtNumber = shirtCode.split("-").pop();

  return (
    <div className="max-w-3xl mx-auto p-8 font-sans text-gray-900 text-center">
      <h1 className="text-4xl font-extrabold mb-8 text-[#D4AF37]">
        You own shirt #{shirtNumber}, thank you for your purchase,{" "}
        {session.user.name?.trim() ? session.user.name : "Friend"}!
      </h1>

      <Image
        src={shirtImageSrc}
        alt={`${shirtDisplayName} shirt`}
        width={400}
        height={400}
        className="mx-auto rounded-xl shadow-lg mb-8"
        priority
      />

     <Link
  href="/nfc/seventytimesseven"
  className="inline-block px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
>
  Connect with others who bought this item
</Link>
    </div>
  );
}
