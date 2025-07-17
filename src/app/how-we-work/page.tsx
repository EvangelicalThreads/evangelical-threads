"use client";

import { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Newsletter from "../../components/Newsletter";
import { motion, AnimatePresence } from "framer-motion";

export default function HowWeWorkPage() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12 relative bg-white text-black overflow-x-hidden">
      {/* Gold glow blur circle */}
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-gradient-to-bl from-[#D4AF37]/15 via-transparent to-transparent rounded-full filter blur-2xl animate-pulse animation-delay-2000" />

      <h1 className="text-4xl font-bold mb-6 text-center">How Our QR Codes Work</h1>

      <p className="mb-10 text-gray-800 leading-relaxed max-w-xl mx-auto text-center">
        Our QR codes are how we combine fashion with technology. Each shirt has a unique code that connects you to a personalized faith message.
      </p>

      <section className="space-y-8 mb-12 max-w-xl mx-auto">
        {/* Step 1 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => toggleStep(1)}
          onKeyDown={(e) => e.key === "Enter" && toggleStep(1)}
          aria-expanded={openStep === 1}
          className="border border-gray-300 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl select-none">👋</div>
            <h2 className="text-2xl font-semibold flex-grow text-gray-900">
              New Here? What to Expect
            </h2>
            <div className="text-3xl font-bold text-[#D4AF37]">
              {openStep === 1 ? "−" : "+"}
            </div>
          </div>

          <AnimatePresence>
            {openStep === 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-700 text-base leading-relaxed"
              >
                <p>
                  After scanning your shirt’s QR code, you’ll be asked to log in. If you don’t have an account, simply select{" "}
                  <Link
                    href="/signup"
                    className="font-semibold underline text-[#D4AF37] hover:text-yellow-700 transition"
                  >
                    Sign Up
                  </Link>{" "}
                  to create one.
                </p>
                <p className="mt-3">
                  Once signed up, you’ll see a welcome popup. Then, scan your QR code again anytime to see the personalized verse tied to your shirt.
                </p>
                <p className="mt-3 text-[#D4AF37] font-semibold">
                  Creating an account makes it easier to access your messages anytime!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => toggleStep(2)}
          onKeyDown={(e) => e.key === "Enter" && toggleStep(2)}
          aria-expanded={openStep === 2}
          className="border border-gray-300 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl select-none">📲</div>
            <h2 className="text-2xl font-semibold flex-grow text-gray-900">
              Already Have an Account?
            </h2>
            <div className="text-3xl font-bold text-[#D4AF37]">
              {openStep === 2 ? "−" : "+"}
            </div>
          </div>

          <AnimatePresence>
            {openStep === 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-700 text-base leading-relaxed"
              >
                <p>
                  Just scan your shirt’s QR code anytime, and you’ll instantly see the personalized verse tied to your shirt — no extra steps needed.
                </p>
                <p className="mt-3 text-[#D4AF37] font-semibold">
                  Your faith and fashion connection is always just a scan away.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Newsletter />

      {/* Social Links */}
      <div className="text-center mt-12 mb-6 max-w-xl mx-auto">
        <h3 className="text-lg font-semibold text-black mb-2">Join the community!!</h3>
        <div className="flex justify-center gap-6 text-black text-2xl">
          <a
            href="https://www.instagram.com/evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </main>
  );
}
