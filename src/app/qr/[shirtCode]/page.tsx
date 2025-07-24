"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

import AnimatedStitchGreeting from "@/components/AnimatedStitchGreeting";

interface Reflection {
  id: string;
  text: string;
  created_at: string;
}

const shirtData: Record<string, {
  verse: { reference: string; text: string };
  imageSrc: string;
  prompt: string;
}> = {
  seventytimesseven: {
    verse: {
      reference: 'Matthew 18:22',
      text: 'Jesus answered, “I tell you, not seven times, but seventy-seven times.”',
    },
    imageSrc: '/products/70x7-back.png',
    prompt: 'Inspired by this, write a reflection on grace, mercy, or forgiveness.',
  },
  goldjacket: {
    verse: {
      reference: 'Song of Songs 4:7',
      text: 'You are altogether beautiful, my darling; there is no flaw in you.',
    },
    imageSrc: '/products/gold-jacket-front.png',
    prompt: 'You’re wrapped in worth the world can’t measure. What’s one truth about your identity that you’re holding onto today?',
  },
  evathawhite: {
    verse: {
      reference: 'Psalm 51:10',
      text: 'Create in me a clean heart, O God, and renew a right spirit within me.',
    },
    imageSrc: '/products/eva-tha-white-front.png',
    prompt: 'Purity isn’t about perfection — it’s about intention. Where is God calling you to show up with a clean heart?',
  },
  evathashirt: {
    verse: {
      reference: 'Matthew 5:14',
      text: 'You are the light of the world. A city set on a hill cannot be hidden.',
    },
    imageSrc: '/products/eva-tha-front.png',
    prompt: 'Even when you feel unseen, your light is doing more than you think. Where have you been called to shine lately?',

  },
};

export default function QRPage() {
  const { shirtCode } = useParams();
  const { data: session } = useSession();

  const shirt = shirtData[shirtCode as string];

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [newReflection, setNewReflection] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showReflections, setShowReflections] = useState(false);

  useEffect(() => {
    if (!showReflections) return;

    async function fetchReflections() {
      try {
        const res = await fetch(`/api/reflections/${shirtCode}`);
        if (!res.ok) throw new Error("Failed to fetch reflections");
        const json = await res.json();
        setReflections(json.reflections || []);

        if (session?.user?.id && json.reflections?.length) {
          const likedStatus: { [id: string]: boolean } = {};
          await Promise.all(
            json.reflections.map(async (r: Reflection) => {
              try {
                const res = await fetch(`/api/likes/status?id=${r.id}`);
                if (res.ok) {
                  const data = await res.json();
                  likedStatus[r.id] = data.liked;
                } else {
                  likedStatus[r.id] = false;
                }
              } catch {
                likedStatus[r.id] = false;
              }
            })
          );
          setLikedMap(likedStatus);
        } else {
          setLikedMap({});
        }
      } catch (error) {
        console.error("Error fetching reflections:", error);
        setReflections([]);
        setLikedMap({});
      }
    }
    fetchReflections();
  }, [shirtCode, session?.user?.id, showReflections]);

  async function toggleLike(reflectionId: string) {
    const wasLiked = likedMap[reflectionId];
    setLikedMap((prev) => ({ ...prev, [reflectionId]: !wasLiked }));

    try {
      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflectionId }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");
      const { liked } = await res.json();
      setLikedMap((prev) => ({ ...prev, [reflectionId]: liked }));
    } catch {
      setLikedMap((prev) => ({ ...prev, [reflectionId]: wasLiked }));
      alert("Could not update like");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newReflection.trim()) return;

    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shirtCode, text: newReflection }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit reflection");
        return;
      }
      setSuccessMessage("Reflection submitted for approval!");
      setNewReflection("");
    } catch {
      alert("Failed to submit reflection");
    }
  }

  if (!session?.user) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center font-sans text-gray-900">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "#D4AF37" }}>
          Let’s Unlock Your Message
        </h2>

        <div className="space-y-8 text-left max-w-md mx-auto text-base leading-relaxed text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-lg font-bold text-[#D4AF37]">1.</span>
            <div>
              <p className="text-lg font-medium">
                <Link
                  href="/login"
                  className="underline font-semibold text-[#D4AF37] hover:text-[#b8932f] transition-colors"
                >
                  Log in
                </Link>{" "}
                to your account
              </p>
              <p className="mt-1">
                Don’t have one?{" "}
                <Link
                  href="/login"
                  className="font-semibold underline text-[#D4AF37] hover:text-yellow-700 transition"
                >
                  Sign up here
                </Link>{" "}
                — it only takes a moment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg font-bold text-[#D4AF37]">2.</span>
            <div>
              <p className="text-lg font-medium">Scan your shirt’s QR code again</p>
              <p className="mt-1">
                After logging in, simply re-scan your shirt’s QR code and your personalized verse will appear.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[#D4AF37] font-semibold">
          Your reflection is one scan away.
        </p>
      </div>
    );
  }

  if (!shirt) {
    return <p className="text-center mt-20 text-lg text-red-500">Invalid shirt code.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans text-gray-900">
      <AnimatedStitchGreeting
        name={session.user.name || "Friend"}
        onComplete={() => setShowReflections(true)}
      />

      {showReflections && (
        <div className="animate-fadeIn">
          {/* Top section: split left/right */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-12 items-start">
            {/* Left side */}
            <div className="md:w-1/2">
              <h2
                className="text-4xl font-extrabold mb-8"
                style={{
                  color: "#D4AF37",
                  textShadow:
                    "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)",
                  lineHeight: 1.1,
                }}
              >
                Thank you for your purchase!
              </h2>
              <Image
                src={shirt.imageSrc}
                alt="Shirt"
                className="rounded-xl shadow-xl w-full max-w-sm object-contain"
                width={500}
                height={500}
                priority={true}
              />
            </div>

            {/* Right side */}
            <div className="md:w-1/2 flex flex-col">
              <p className="mb-6 italic text-lg text-gray-700 leading-relaxed border-l-4 border-[#D4AF37] pl-4">
                <strong>{shirt.verse.reference}</strong>
                <br />
                {shirt.verse.text}
                <br />
                <br />
                {shirt.prompt}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                  className="w-full border border-[#D4AF37] rounded-lg p-4 mb-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
                  placeholder="Write your reflection here..."
                  maxLength={150}
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  rows={5}
                  required
                />
                <button
                  type="submit"
                  className="inline-block self-start px-8 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
                >
                  Submit Reflection
                </button>
                {successMessage && (
                  <p className="mt-4 text-black font-semibold text-lg">
                    {successMessage}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Reflections list */}
          <section>
            <h3 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2">
              Reflections
            </h3>
            <ul className="space-y-6">
              {reflections.length === 0 ? (
                <p className="text-gray-500 italic">No reflections yet. Be the first!</p>
              ) : (
                reflections.map((r) => (
                  <li
                    key={r.id}
                    className="bg-gray-100 p-6 rounded-xl shadow-md flex justify-between items-start"
                  >
                    <div className="max-w-[85%]">
                      <p className="text-gray-900">{r.text}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleLike(r.id)}
                      aria-pressed={likedMap[r.id]}
                      aria-label={
                        likedMap[r.id] ? "Unlike reflection" : "Like reflection"
                      }
                      className="flex items-center gap-1 ml-6 focus:outline-none"
                    >
                      {likedMap[r.id] ? (
                        <SolidHeartIcon className="h-7 w-7 text-pink-500" />
                      ) : (
                        <OutlineHeartIcon className="h-7 w-7 text-gray-400" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          opacity: 0;
          animation-name: fadeIn;
          animation-duration: 0.8s;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in;
        }
      `}</style>
    </div>
  );
}
