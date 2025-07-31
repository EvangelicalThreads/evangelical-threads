"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
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

interface Comment {
  id: string;
  comment: string;
  created_at: string;
}

// Generate shirt data for 36 shirts, only 7-30-25-001 has real data, rest placeholders
const shirtData: Record<
  string,
  {
    verse: { reference: string; text: string };
    imageSrc: string;
    prompt: string;
  }
> = {};

for (let i = 1; i <= 36; i++) {
  const code = `7-30-25-${String(i).padStart(3, "0")}`;

  if (i === 1) {
    // The original seventytimesseven shirt data renamed to 7-30-25-001
    shirtData[code] = {
      verse: {
        reference: "Matthew 18:22",
        text: 'Jesus answered, “I tell you, not seven times, but seventy-seven times.”',
      },
      imageSrc: "/products/70x7-back.png",
      prompt: "Inspired by this, write a reflection on grace, mercy, or forgiveness.",
    };
  } else {
    // Placeholder for other shirts - you can update these later
    shirtData[code] = {
      verse: {
        reference: "Coming Soon",
        text: "Stay tuned for new shirt reflections!",
      },
      imageSrc: "/products/placeholder.png", // You can replace with actual images later
      prompt: "Write your reflection inspired by this upcoming shirt.",
    };
  }
}

export default function QRPage() {
  const { shirtCode } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const shirt = shirtData[shirtCode as string];

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [newReflection, setNewReflection] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showReflections, setShowReflections] = useState(false);

  // COMMENTS STATE
  const [commentsMap, setCommentsMap] = useState<{ [reflectionId: string]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [reflectionId: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [reflectionId: string]: boolean }>({});
  const [showComments, setShowComments] = useState<{ [reflectionId: string]: boolean }>({});

  // Redirect unauthenticated users to login with shirtCode param
  useEffect(() => {
    if (session === undefined) return; // still loading session
    if (!session?.user) {
      router.push(`/login?shirtCode=${encodeURIComponent(shirtCode as string)}`);
    } else {
      setShowReflections(true);
    }
  }, [session, router, shirtCode]);

  // Fetch reflections and liked status when reflections shown
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

  // --- COMMENTS FUNCTIONS ---

  async function fetchComments(reflectionId: string) {
    setLoadingComments((prev) => ({ ...prev, [reflectionId]: true }));
    try {
      const res = await fetch(`/api/comments/${reflectionId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const json = await res.json();
      setCommentsMap((prev) => ({ ...prev, [reflectionId]: json.comments || [] }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentsMap((prev) => ({ ...prev, [reflectionId]: [] }));
    } finally {
      setLoadingComments((prev) => ({ ...prev, [reflectionId]: false }));
    }
  }

  async function handleAddComment(reflectionId: string, commentText: string) {
    if (!commentText.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflectionId, comment: commentText }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit comment");
        return;
      }
      // Refresh comments
      await fetchComments(reflectionId);
      // Clear input
      setNewComments((prev) => ({ ...prev, [reflectionId]: "" }));
    } catch {
      alert("Failed to submit comment");
    }
  }

  if (!session?.user) {
    // Since we redirect, this will rarely render, but just in case:
    return <p className="text-center mt-20 text-lg text-gray-700">Redirecting to login...</p>;
  }

  if (!shirt) {
    return (
      <p className="text-center mt-20 text-lg text-red-500">Invalid shirt code.</p>
    );
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
                    className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
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
                    </div>

                    {/* Comments toggle */}
                    <button
                      onClick={() => {
                        const isOpen = showComments[r.id];
                        if (!isOpen) fetchComments(r.id);
                        setShowComments((prev) => ({ ...prev, [r.id]: !isOpen }));
                      }}
                      className="text-sm text-[#D4AF37] underline self-start"
                    >
                      {showComments[r.id] ? "Hide Comments" : "View Comments"}
                    </button>

                    {/* Comments list */}
                    {showComments[r.id] && (
                      <div className="mt-2 pl-4 border-l border-gray-300 space-y-4 max-h-56 overflow-y-auto">
                        {loadingComments[r.id] ? (
                          <p className="text-gray-500 text-sm">Loading comments...</p>
                        ) : commentsMap[r.id]?.length === 0 ? (
                          <p className="italic text-gray-500 text-sm">No comments yet.</p>
                        ) : (
                          commentsMap[r.id]?.map((c) => (
                            <div key={c.id} className="text-gray-700 text-sm">
                              <p>{c.comment}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(c.created_at).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}

                        {/* Add comment form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment(r.id, newComments[r.id] || "");
                          }}
                          className="mt-3"
                        >
                          <textarea
                            rows={2}
                            maxLength={200}
                            placeholder="Write a comment..."
                            value={newComments[r.id] || ""}
                            onChange={(e) =>
                              setNewComments((prev) => ({
                                ...prev,
                                [r.id]: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                            required
                          />
                          <button
                            type="submit"
                            className="mt-1 px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-yellow-600 transition text-sm font-semibold"
                          >
                            Submit Comment
                          </button>
                        </form>
                      </div>
                    )}
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
