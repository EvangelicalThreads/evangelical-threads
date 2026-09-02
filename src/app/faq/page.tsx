"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Newsletter from "../../components/Newsletter";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const faqData = [
  {
    question: "How long does shipping take?",
    answer:
      "We typically process orders within 1–2 business days. Shipping usually takes 3–7 business days depending on your location.",
  },
  {
    question: "What is your return/exchange policy?",
    answer:
      "All sales are final, and we're not currently accepting returns or exchanges. If something arrives damaged or isn't what you ordered, reach out to ryvol.shop@gmail.com and we'll make it right.",
  },
  {
    question: "How do I know what size to order?",
    answer:
      "Check out our sizing chart on each product page for detailed measurements to help you choose the perfect fit.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards via Stripe.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Orders are processed quickly, but please contact us immediately if you need to change or cancel your order. We will do our best to help!",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the United States. We hope to expand soon!",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, we’ll email you a tracking number to follow your package’s journey.",
  },
  {
    question: "Who can I contact if I have more questions?",
    answer: "Feel free to email us at ryvol.shop@gmail.com anytime!",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-[#F2F0EB] text-[#14161a]">
      <div className="max-w-[640px] mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">

        {/* Header */}
        <div className="text-center mb-20 md:mb-24">
          <img
            src="/brand/ryvol-emblem-navy.png"
            alt="RYVOL"
            className="w-11 h-11 mx-auto mb-10"
          />
          <h1 className="rv-serif italic text-[34px] md:text-[44px] leading-[1.1] text-[#14161a] mb-4">
            Questions.
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#14161a]/40">
            Answered
          </p>
        </div>

        <section className="mb-20 md:mb-24">
          <div>
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-[#14161a]/10 py-6 first:pt-0">
                <button
                  className="flex justify-between items-center gap-6 w-full text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="rv-serif italic text-[17px] md:text-[19px] text-[#14161a]">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-[#14161a]/40 text-lg font-light w-4 text-center">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.p
                      className="mt-4 text-[14px] md:text-[15px] leading-[1.8] text-[#14161a]/65 pr-10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-20">
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/70 border-b border-[#14161a]/30 pb-0.5 hover:border-[#14161a] hover:text-[#14161a] transition"
          >
            Shop
          </Link>
        </section>

        <Newsletter />

        <div className="text-center mt-24 pb-4">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            Instagram — TikTok
          </h3>

          <div className="flex justify-center gap-6 text-[#14161a]/60 text-xl">
            <a
              href="https://www.instagram.com/ryvol.shop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#14161a] transition" />
            </a>

            <a
              href="https://www.tiktok.com/@ryvol.shop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="hover:text-[#14161a] transition" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
