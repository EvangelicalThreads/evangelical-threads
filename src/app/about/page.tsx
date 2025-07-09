"use client";

import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Newsletter from "../../components/Newsletter";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How long does shipping take?",
    answer:
      "We typically process orders within 1–2 business days. Shipping usually takes 3–7 business days depending on your location.",
  },
  {
    question: "What is your return/exchange policy?",
    answer:
      "We accept returns or exchanges within 14 days of delivery. Items must be unworn and in original condition. Please contact evangelicalthreads@gmail.com to start a return.",
  },
  {
    question: "How do I know what size to order?",
    answer:
      "Check out our sizing chart on each product page for detailed measurements to help you choose the perfect fit.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards via Stripe and PayPal.",
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
    answer: "Feel free to email us at evangelicalthreads@gmail.com anytime!",
  },
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-black">
      <h1 className="text-4xl font-bold text-black mb-6">About Evangelical Threads</h1>

      <p className="text-lg mb-6">
        A lot of brands play it safe. Pretty fonts, a verse on the back, maybe a cross somewhere. Evangelical Threads, abbreviated EVA-THA, isn’t about checking boxes. It started with a deeper question: <em>What does it mean to be seen by God, fully, and still be clothed in purpose?</em>
      </p>
      <p className="text-lg mb-6">
        EVA stands for Eve, the first to fall, yes, but also the first to be clothed by God Himself. THA comes from an old Hebrew root meaning “store.” And the dash in between? That’s no accident. On the fourth day of creation, God separated light from dark. That dash is the line between shame and grace, fear and identity, who we were, and who we’re becoming.
      </p>
      <p className="text-lg mb-6">
        EVA-THA isn’t just Christian clothing. It’s theology stitched into fabric. Every piece tells a story, not just of faith, but of <em>falling and still being chosen</em>. We don’t do loud logos or empty trends. We do meaning. Clean designs. Bold truth. Real identity. Clothes that spark conversations without shouting.
      </p>

      {/* Contact Section */}
      <section className="bg-white border border-black rounded-xl p-6 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
        <p className="mb-2">
          Have questions or feedback? Email us at:
          <a
            href="mailto:evangelicalthreads@gmail.com"
            className="text-black font-medium ml-1"
          >
            evangelicalthreads@gmail.com
          </a>
        </p>
        <p className="mb-4">Or connect with us on social media:</p>
        <div className="flex gap-4 text-2xl text-black">
          <a href="https://www.instagram.com/evangelicalthreads" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-gray-600 transition transform hover:scale-110" />
          </a>
          <a href="https://www.tiktok.com/@evangelicalthreads" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="hover:text-gray-600 transition transform hover:scale-110" />
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white border border-black rounded-xl p-6 shadow-md mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">FAQs</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-2">
              <button
                className="flex justify-between items-center w-full text-left text-lg font-medium text-black"
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

      <Newsletter />
    </main>
  );
}
