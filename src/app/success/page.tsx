export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
        <p className="text-gray-700 text-lg mb-6">Thank you for your purchase. Your order is being processed.</p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
