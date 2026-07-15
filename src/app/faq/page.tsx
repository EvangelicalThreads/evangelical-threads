"use client";

import { useState } from "react";
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
      "We accept returns or exchanges within 14 days of delivery. Items must be unworn and in original condition. Please contact ryvol.shop@gmail.com to start a return.",
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
    <main className="max-w-4xl mx-auto px-6 py-12 text-black">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      <section className="bg-white border border-black rounded-xl p-6 shadow-md mb-12 max-w-xl mx-auto">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-2">
              <button
                className="flex justify-between items-center w-full text-left text-lg font-medium"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    className="mt-2 text-sm text-gray-700"
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

      <section className="max-w-xl mx-auto text-center">
        <Newsletter />
        
        <div className="text-center mt-24 pb-20">
          <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#14161a]/60 mb-5">
            Follow the Pursuit
          </h3>
        
          <div className="flex justify-center gap-6 text-[#14161a] text-2xl">
            <a
              href="https://www.instagram.com/shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#A1543E] transition" />
            </a>
        
            <a
              href="https://www.tiktok.com/@shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="hover:text-[#A1543E] transition" />
            </a>
          </div>
        </div>
        
      </section>
    </main>
  );
}
