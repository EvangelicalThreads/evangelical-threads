"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

interface Reflection {
  id: string;
  text: string;
  created_at: string;
  likesCount?: number;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
}

export default function SharedReflectionsPage() {
  const { data: session } = useSession();

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [newReflection, setNewReflection] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [commentsMap, setCommentsMap] = useState<{ [reflectionId: string]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [reflectionId: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [reflectionId: string]: boolean }>({});
  const [showComments, setShowComments] = useState<{ [reflectionId: string]: boolean }>({});

  // Load reflections on mount
  useEffect(() => {
    async function fetchReflections() {
      try {
        const res = await fetch(`/api/reflections/7-30-25-001`); // Hardcoded for 70x7 shirt
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
  }, [session?.user?.id]);

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
        body: JSON.stringify({ shirtCode: "7-30-25-001", text: newReflection }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit reflection");
        return;
      }
      setSuccessMessage("Reflection submitted for approval!");
      setNewReflection("");
      // Refresh reflections after submit
      const refreshed = await fetch(`/api/reflections/7-30-25-001`);
      const json = await refreshed.json();
      setReflections(json.reflections || []);
    } catch {
      alert("Failed to submit reflection");
    }
  }

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
      const res = await fetch("/api/comments/add",{
 
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
    return (
      <p className="text-center mt-20 text-gray-600">Please sign in to see and add reflections.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-gray-900">
      <h1 className="text-4xl font-extrabold mb-8 text-[#D4AF37]">Seventy Times Seven Community Reflections</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col">
        <textarea
          placeholder="Write your reflection here..."
          maxLength={150}
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          rows={5}
          className="border border-[#D4AF37] rounded-lg p-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] mb-4"
          required
        />
        <button
          type="submit"
          className="self-start px-8 py-3 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-yellow-600 transition shadow-md"
        >
          Submit Reflection
        </button>
        {successMessage && (
          <p className="mt-4 text-black font-semibold text-lg">{successMessage}</p>
        )}
      </form>

      {reflections.length === 0 ? (
        <p className="italic text-gray-500">No reflections yet. Be the first!</p>
      ) : (
        <ul className="space-y-8">
          {reflections.map((r) => (
            <li
              key={r.id}
              className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-900">{r.text}</p>
                <button
                  onClick={() => toggleLike(r.id)}
                  aria-pressed={likedMap[r.id]}
                  aria-label={likedMap[r.id] ? "Unlike reflection" : "Like reflection"}
                  className="flex items-center gap-1 ml-6 focus:outline-none"
                >
                  {likedMap[r.id] ? (
                    <SolidHeartIcon className="h-7 w-7 text-pink-500" />
                  ) : (
                    <OutlineHeartIcon className="h-7 w-7 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">{new Date(r.created_at).toLocaleString()}</p>

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
          ))}
        </ul>
      )}
    </div>
  );
}
