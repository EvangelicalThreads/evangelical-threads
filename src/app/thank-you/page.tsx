// app/thank-you/page.tsx
import { X } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-6">
        Thank You for Your Purchase!
      </h1>
      <p className="text-gray-800 text-lg md:text-xl max-w-xl mb-8">
        Your support helps us spread faith, style, and purpose through every thread.
      </p>
      <div className="border-4 border-[#D4AF37] rounded-3xl p-6 shadow-md max-w-md w-full mb-8">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">
          You are the light of the world ✨
        </h2>
        <p className="text-gray-700">
          Tap the NFC chip on your shirt to read reflections, add your own, and be part of something eternal.
        </p>
      </div>

      <Link
        href="/shop" // or "/" depending on your route
        className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
