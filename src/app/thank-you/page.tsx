import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#14161a ] mb-6">
        Thank You for Your Purchase!
      </h1>
      <p className="text-gray-800 text-lg md:text-xl max-w-xl mb-8">
        Your support helps us spread faith, style, and purpose through every thread.
      </p>
      <div className="border-4 border-[#14161a ] rounded-3xl p-6 shadow-md max-w-md w-full mb-8">
        <h2 className="text-2xl font-bold text-[#14161a ] mb-4">
          You are the light of the world ✨
        </h2>
        <p className="text-gray-700">
          Tap the NFC chip on your shirt to read reflections, add your own, and be part of something eternal.
        </p>
      </div>

      <Link
        href="/shop" // or "/" depending on your route
        className="inline-block mt-6 px-6 py-3 border border-[#14161a ] text-[#14161a ] rounded hover:bg-[#14161a ] hover:text-white transition font-semibold shadow-md"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
