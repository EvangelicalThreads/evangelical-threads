"use client";

import React, { useEffect, useState } from "react";

interface AnimatedStitchGreetingProps {
  name: string;
  onComplete?: () => void;
}

export default function AnimatedStitchGreeting({ name, onComplete }: AnimatedStitchGreetingProps) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    // Total animation length in ms, adjust to match your SVG animation duration
    const animationDuration = 4000;

    const timeout = setTimeout(() => {
      setAnimationDone(true);
      if (onComplete) onComplete();
    }, animationDuration);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto mb-12 text-center select-none relative" style={{ height: 100 }}>
      <svg
        width="100%"
        height="100"
        viewBox="0 0 600 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Welcome, ${name}`}
      >
        {/* Text path */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="48"
          fontFamily="'Dancing Script', cursive"
          stroke="#D4AF37"
          strokeWidth="1.2"
          fill="none"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: animationDone ? 0 : 600,
            animation: "dash 4s linear forwards",
            textShadow: "0 0 6px rgba(212, 175, 55, 0.8)",
          }}
        >
          {`Welcome, ${name}`}
        </text>

        {/* Needle icon */}
        <circle
          r="6"
          fill="#D4AF37"
          style={{
            transformOrigin: "center",
            animation: animationDone ? "none" : "needleMove 4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <animateMotion dur="4s" fill="freeze" path={`M0,50 H600`} />
        </circle>
      </svg>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes needleMove {
          from { transform: translateX(0); }
          to { transform: translateX(600px); }
        }
      `}</style>
    </div>
  );
}
