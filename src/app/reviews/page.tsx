"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Newsletter from '../../components/Newsletter';

export default function ReviewsPage() {
  const [email, setEmail] = useState("");

  function handleSubscribe() {
    alert(`Thanks for subscribing with ${email}!`);
    setEmail("");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Customer Reviews</h1>

      <div className="border border-gray-200 p-6 rounded shadow-sm text-center">
        <p className="text-gray-800 italic mb-4">
          Reviews coming soon! We can’t wait to hear what you think.
        </p>
        <p className="text-gray-600 mb-6">
          Have feedback or a story to share? Reach out or subscribe below!
        </p>
      </div>
     
     <Newsletter />

      {/* Social Links */}
      <div className="text-center mb-12">
        <h3 className="text-lg font-semibold text-black mb-2">Join the community!!</h3>
        <div className="flex justify-center gap-6 text-black text-2xl">
          <a
            href="https://www.instagram.com/evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-gray-600 transition" />
          </a>
          <a
            href="https://www.tiktok.com/@evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="hover:text-gray-600 transition" />
          </a>
        </div>
      </div>
    </main>
  );
}
