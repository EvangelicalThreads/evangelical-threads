'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Reflection {
  id: string;
  text: string;
  created_at: string;
  likes_count: number;
}

interface Props {
  reflection: Reflection;
}

export default function ReflectionCard({ reflection }: Props) {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(reflection.likes_count ?? 0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // UUID validation helper
  const isUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  useEffect(() => {
    async function fetchLikeStatus() {
      if (!reflection.id || !isUUID(reflection.id)) {
        console.error("Invalid reflection ID:", reflection.id);
        return;
      }
      try {
        const res = await fetch(`/api/likes/status?id=${reflection.id}`);
        if (!res.ok) {
          console.error("Failed to fetch like status");
          return;
        }
        const data = await res.json();
        setLikesCount(data.likesCount ?? 0);
        setLiked(data.liked ?? false);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    }
    fetchLikeStatus();
  }, [reflection.id]);

  async function toggleLike() {
    if (!session?.user?.id) {
      alert("You must be logged in to like reflections.");
      return;
    }

    if (!isUUID(reflection.id)) {
      alert("Invalid reflection ID detected. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflectionId: reflection.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Toggle like failed:", data.error);
        alert("Failed to toggle like. Please try again.");
        return;
      }

      setLikesCount(data.likesCount ?? 0);
      setLiked(data.liked ?? false);
    } catch (error) {
      console.error("Network error toggling like:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded mb-4 shadow">
      <p className="text-sm mb-2">{reflection.text}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLike}
          disabled={loading}
          className={`transition transform hover:scale-110 ${
            liked ? "text-pink-500" : "text-gray-400"
          }`}
          aria-label={liked ? "Unlike reflection" : "Like reflection"}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <span className="text-sm text-gray-600">{likesCount}</span>
      </div>
    </div>
  );
}
