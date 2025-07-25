export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-sm text-neutral-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-black">Privacy & Cookies</h1>

      <p className="mb-4">
        At <strong>Evangelical Threads</strong>, your privacy is deeply respected. We only collect what’s necessary to
        help you shop, stay logged in, and receive updates — nothing more.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-3">What We Use</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li><strong>Essential cookies</strong> to keep items in your cart and manage login sessions.</li>
        <li><strong>Optional analytics</strong> (like page views) to help us improve — but only if you opt in.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-3">We Don’t</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Track you across other websites.</li>
        <li>Sell or share your data with advertisers.</li>
        <li>Store sensitive information like payment details ourselves.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-3">Your Choices</h2>
      <p className="mb-4">
        You can clear cookies at any time from your browser. If we ever use optional cookies, we’ll always ask first.
      </p>

      <p className="mt-10">
        Questions? Reach us at{' '}
        <a
          href="mailto:evangelicalthreads@gmail.com"
          className="underline text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
        >
          evangelicalthreads@gmail.com
        </a>.
      </p>
    </div>
  );
}
