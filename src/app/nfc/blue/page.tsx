// src/app/page.tsx
"use client";

/**
 * Evangelical Threads — QR Shirt Experience (FW23)
 * Ultra-polished LV-level launch page
 * - Faith × Future Fashion
 * - Fully interactive, frictionless, luxury animations
 * - Sections: Hero, 3D Tee, Story, Care, Materials, Journey, Extras, Footer
 * - All hooks for R3F inside <Canvas>
 * - No login required
 */

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useSpring, Variants } from "framer-motion";



// --------------------------------------------------
// Motion Variants
// --------------------------------------------------
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  },
};

// --------------------------------------------------
// Scroll Progress Bar
// --------------------------------------------------
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[4px] bg-black z-[60] shadow-md"
      aria-hidden="true"
    />
  );
}

// --------------------------------------------------
// 3D Tee Model
// --------------------------------------------------
function Tee3DModel() {
  const modelRef = useRef<THREE.Group>(null);

  // Lazy-load and preload GLB for faster first paint
  useGLTF.preload("/models/t-shirt.glb");
  const { scene } = useGLTF("/models/t-shirt.glb") as { scene: THREE.Group };

  // Apply slightly lighter black/charcoal material (memoized)
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#000000ff",
          metalness: 0.25,
          roughness: 0.55,
        });
        (child as THREE.Mesh).frustumCulled = true; // skip offscreen
      }
    });

    // Center & scale
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale = 1.5 / Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
    scene.rotation.set(0, 0, 0);
  }, [scene]);

  // Subtle multi-axis rotation & bob
  useFrame(({ clock }) => {
    if (!modelRef.current) return;
    const t = clock.elapsedTime;
    modelRef.current.rotation.y = 0.05 * Math.sin(t * 0.7);
    modelRef.current.rotation.x = 0.02 * Math.sin(t * 1.1);
    modelRef.current.rotation.z = 0.015 * Math.sin(t * 0.9);
    modelRef.current.position.y = 0.03 * Math.abs(Math.sin(t * 1.2));
  });

  return (
    <group ref={modelRef} position={[0.5, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// --------------------------------------------------
// Floating Particles Behind Tee
// --------------------------------------------------
function FloatingParticles({ count = 120 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Reduced particle count & memoized positions
  const particles = useMemo(() => {
    return Array.from({ length: Math.min(count, 90) }).map(() => ({
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 4,
      z: (Math.random() - 0.5) * 4,
      scale: Math.random() * 0.03 + 0.01,
      speed: Math.random() * 0.003 + 0.001,
    }));
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 3) p.y = -2;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, particles.length]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.05} />
    </instancedMesh>
  );
}

// --------------------------------------------------
// Scroll-To-Top Button
// --------------------------------------------------
function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setShow(scrollTop > 600); // show after scrolling 600px
      setScrollPercent((scrollTop / docHeight) * 100); // progress from 0-100%
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white shadow-xl hover:bg-neutral-800 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 z-[1000]"
      aria-label="Scroll to top"
    >
      {/* Circular progress */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 36 36"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="white"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray="100"
          strokeDashoffset={100 - scrollPercent}
          strokeLinecap="round"
        />
      </svg>

      <span className="relative z-10 text-xl font-bold">↑</span>
    </button>
  );
}

// --------------------------------------------------
// Hero Section — Cinematic Luxury
// --------------------------------------------------
// --------------------------------------------------
// Components for text
// --------------------------------------------------

function ClickAndDrag() {
  return (
    <div className="w-full max-w-md mx-auto text-center mt-4 relative z-20">
      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="text-sm sm:text-base md:text-lg italic text-neutral-700"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Click & drag to explore the blank we used to create your shirt!
      </motion.p>
    </div>
  );
}

// --------------------------------------------------
// ThankYouSection — Standalone Intro
// --------------------------------------------------


function ThankYouSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-4 bg-white z-10">
      <motion.div
        className="w-full max-w-3xl mx-auto text-center px-4 sm:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2
          className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Thank You for Your Purchase 
        </h2>
        <p
          className="text-base sm:text-lg text-neutral-700 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Every stitch tells a story. Watch how your shirt came to life, from our vision to production.
        </p>
      </motion.div>
    </section>
  );
}

// --------------------------------------------------
// Hero Section — Cinematic Luxury
// --------------------------------------------------
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 py-16 lg:py-28">

      {/* Subtle Background Layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 25% 25%, #f5f5f7, #e0e0e2, #f9f9f9)",
          filter: "blur(60px)",
        }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 60, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.1), rgba(200,200,255,0.05), rgba(255,200,200,0.05))",
          mixBlendMode: "overlay",
          filter: "blur(100px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 180, ease: "linear" }}
      />
      {/* Thank You & Story Intro */}
<ThankYouSection />



      {/* Video + Text Section — Side by Side on Mobile */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 mt-6">

        {/* Video — Left */}
        <div className="w-full sm:w-1/2 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[380px] sm:h-[480px] md:h-[550px] lg:h-[600px] object-cover rounded-3xl shadow-xl"
            style={{ filter: "brightness(0.9)" }} // darken a bit so text stands out
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Text — Right */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center">
          <motion.div
            className="bg-transparent relative z-20 p-3 sm:p-6"
            variants={fadeInUp}
            initial="hidden"
            animate="show"
          >
            <p
              className="text-lg md:text-xl text-neutral-800 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Every journey begins with a blank canvas.
            </p>
            <p
              className="text-lg md:text-xl text-neutral-800 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Watch as each thread is stitched with care, transforming vision into reality.
            </p>
            <p
              className="text-sm sm:text-base md:text-lg italic text-neutral-700"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The craftsmanship, attention to detail, and passion come alive in every shirt.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content layout — Shirt Left, Click & Drag Right */}
      <div className="flex flex-col sm:flex-row items-start justify-center gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 mt-12 lg:mt-20">
        
        {/* 3D Shirt Canvas — Left */}
        <div className="flex flex-col items-center w-full sm:w-1/2 relative">
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 40 }}
            className="w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[480px] h-[400px] sm:h-[650px] lg:h-[800px] rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-2xl relative"
          >
            <Canvas camera={{ position: [0.5, 1.5, 12], fov: 45 }}>
  <color attach="background" args={["#fefefe"]} />

  {/* LIGHTS */}
  <ambientLight intensity={0.6} />
  <directionalLight position={[5, 5, 5]} intensity={0.7} />
  <directionalLight position={[-5, 5, 5]} intensity={0.4} />
  
  <Tee3DModel />
  <FloatingParticles count={180} />
  <OrbitControls enableZoom={false} enablePan={false} />


              <color attach="background" args={["#fefefe"]} />
              <Tee3DModel /> {/* No light affecting the video, keep 3D separate */}
              <FloatingParticles count={180} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <ScrollToTop />

            {/* Lens glow overlay */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-white opacity-5 pointer-events-none"
              animate={{ opacity: [0.03, 0.08, 0.03] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Click & Drag Hint — Right */}
        <div className="flex flex-col justify-center w-full sm:w-1/2">
          <ClickAndDrag />
        </div>
      </div>
    </section>
  );
}




// --------------------------------------------------
// Care Section
// --------------------------------------------------
function CareSection() {
  const icons = ["🧺", "🌬️", "🚫🔥", "🌿"];
  const labels = ["Machine wash cold", "Air dry", "No tumble dry", "Eco-friendly care"];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h4 className="text-3xl font-bold text-neutral-900 mb-12">CARE INSTRUCTIONS</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {icons.map((icon, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-5xl">{icon}</span>
              <p className="text-neutral-700 text-sm">{labels[i]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------
// Materials Section — Side by Side on Mobile & Desktop
// --------------------------------------------------
function MaterialsSection() {
  return (
    <section className="py-28 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 flex flex-row items-center gap-6">
        {/* Left — Text Info */}
        <div className="w-1/2 space-y-4 text-left">
          <h4 className="text-2xl sm:text-3xl font-bold">MATERIALS OF YOUR EVA-THA T-SHIRT</h4>
          <p className="text-base sm:text-lg">100% Combed Cotton</p>
          <p className="text-xs sm:text-sm text-neutral-300">
            *All our fabrics are AS Colour certified, GOTS, and OEKO-TEX Class 1 compliant.*
          </p>
        </div>

        {/* Right — Image */}
        <div className="w-1/2">
          <img
            src="/cotton.jpg"
            alt="Cotton Material"
            className="w-full h-auto rounded-3xl shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}


// --------------------------------------------------
// Journey Section
// --------------------------------------------------
function JourneySection() {
  const steps = [
    { icon: "🧵", title: "Fabric Sourced", text: "Premium cotton sourced ethically and sustainably from trusted suppliers around the globe. Every thread tells a story." },
    { icon: "🎨", title: "Dyed & Finished", text: "Eco-friendly dyes and low-impact finishing ensure the fabric retains vibrancy while caring for the environment." },
    { icon: "🪡", title: "Cut & Sewn", text: "Every piece is assembled under fair trade conditions. Skilled artisans bring your t-shirt to life with precision." },
    { icon: "📦", title: "Delivered", text: "Shipped directly to your hands in sustainable packaging, ready to be cherished and worn." },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Subtle glow circles in background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200 via-teal-200 to-green-200 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-neutral-900"
        >
          THE JOURNEY OF YOUR SHIRT
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex items-start gap-6 bg-white p-6 rounded-3xl shadow-xl border border-neutral-100 hover:shadow-2xl transition-shadow duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <div className="text-5xl">{step.icon}</div>
              <div className="text-left">
                <h5 className="text-xl font-semibold text-neutral-900">{step.title}</h5>
                <p className="text-neutral-600 text-sm mt-2 leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------
// Footer Section
// --------------------------------------------------
function Footer() {
  return (
    <footer className="relative py-20 bg-neutral-950 text-neutral-400 text-center">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <motion.h5
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-white font-bold text-2xl"
        >
          EVANGELICAL THREADS
        </motion.h5>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          © {new Date().getFullYear()} Evangelical Threads. All rights reserved.
        </motion.p>
        <motion.div
          className="flex justify-center gap-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
           <a
    href="https://www.instagram.com/evangelicalthreads"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white transition-colors duration-300"
  >
    Instagram
  </a>

  <a
    href="https://www.tiktok.com/@evangelicalthreads"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white transition-colors duration-300"
  >
    TikTok
  </a>
</motion.div>
      </div>
    </footer>
  );
}

// --------------------------------------------------
// Page Export
// --------------------------------------------------
export default function HomePage() {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <div className="font-sans text-neutral-900 bg-white relative">
      <ScrollProgressBar />
      <main className={prefersReducedMotion ? "motion-safe" : ""}>
        <HeroSection />
        <MaterialsSection />
                <JourneySection />
        <CareSection />
      </main>
      <Footer />
    </div>
  );
}
