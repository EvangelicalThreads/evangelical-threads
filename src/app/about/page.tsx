'use client';

import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Newsletter from '../../components/Newsletter';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">About Evangelical Threads</h1>

      <p className="text-lg text-gray-700 mb-6">
        A lot of brands play it safe. Pretty fonts, a verse on the back, maybe a cross somewhere.
        Evangelical Threads, abbreviated EVA-THA, isn’t about checking boxes. It started with a deeper
        question: <em>What does it mean to be seen by God, fully, and still be clothed in purpose?</em>
      </p>

      <p className="text-lg text-gray-700 mb-6">
        EVA stands for Eve, the first to fall, yes, but also the first to be clothed by God Himself.
        THA comes from an old Hebrew root meaning “store.” And the dash in between? That’s no accident.
        On the fourth day of creation, God separated light from dark. That dash is the line between
        shame and grace, fear and identity, who we were, and who we’re becoming.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        EVA-THA isn’t just Christian clothing. It’s theology stitched into fabric. Every piece tells a
        story, not just of faith, but of <em>falling and still being chosen</em>. We don’t do loud logos
        or empty trends. We do meaning. Clean designs. Bold truth. Real identity. Clothes that spark
        conversations without shouting.
      </p>

      <section className="mb-12 bg-[#f9f7f1] rounded-xl p-6 shadow-md text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[#D4AF37]">Wondering how our NFC chips work?</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Learn how we connect fashion and technology to take you on a personalized faith journey.
        </p>
        <Link
          href="/how-we-work"
          className="inline-block px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Click here to learn more
        </Link>
      </section>

      <Newsletter />

      <div className="text-center mt-10">
        <h3 className="text-lg font-semibold text-black mb-2">Join the community!!</h3>
        <div className="flex justify-center gap-6 text-black text-2xl">
          <a
            href="https://www.instagram.com/evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="hover:text-gray-600 transition" />
          </a>
          <a
            href="https://www.tiktok.com/@evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok className="hover:text-gray-600 transition" />
          </a>
        </div>
      </div>
    </main>
  );
}
