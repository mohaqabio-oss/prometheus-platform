"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import gsap from "gsap";
import { ChevronDown, ArrowLeft } from "lucide-react";

export function PrometheusHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "PROMETHEUS",
      line1: "Prometheus, the vision of youth,",
      line2: "the mindset of scientists.",
    },
    {
      title: "INNOVATION",
      line1: "Pushing the boundaries of technology,",
      line2: "empowering the next generation.",
    },
    {
      title: "FUTURE",
      line1: "Open source research and development,",
      line2: "building a better tomorrow.",
    },
  ];

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. THREE.JS SCENE SETUP (Nebula & Mountain Horizon)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05040a, 0.012);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 22);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. RED / PURPLE / DEEP MAGENTA NEBULA PARTICLES
    const particleCount = 3500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorRed = new THREE.Color(0xd92652); // Red / Crimson
    const colorPurple = new THREE.Color(0x8a2be2); // Deep Purple / Violet
    const colorAmber = new THREE.Color(0xe84a0c); // Promethean Amber

    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) + Math.random() * 4;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const ratio = Math.random();
      const pColor =
        ratio < 0.4
          ? colorRed.clone().lerp(colorPurple, ratio * 2.5)
          : colorPurple.clone().lerp(colorAmber, (ratio - 0.4) * 1.6);

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const nebulaParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(nebulaParticles);

    // 3. BLACK PARALLAX MOUNTAINS / TERRAIN SILHOUETTE
    const mountainGeo = new THREE.PlaneGeometry(120, 60, 64, 32);
    const mountainPos = mountainGeo.attributes.position;

    // Displace vertices to generate mountain ridge peaks
    for (let i = 0; i < mountainPos.count; i++) {
      const x = mountainPos.getX(i);
      const y = mountainPos.getY(i);
      const zDisplacement =
        Math.sin(x * 0.12) * Math.cos(y * 0.15) * 4.5 +
        Math.sin(x * 0.3) * 2.0 +
        Math.cos(y * 0.25) * 1.5;
      mountainPos.setZ(i, zDisplacement);
    }
    mountainGeo.computeVertexNormals();

    const mountainMat = new THREE.MeshBasicMaterial({
      color: 0x05040a,
      wireframe: false,
    });
    const mountainWireMat = new THREE.MeshBasicMaterial({
      color: 0x3b1c4a,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
    mountainMesh.rotation.x = -Math.PI / 2.2;
    mountainMesh.position.set(0, -8, -10);
    scene.add(mountainMesh);

    const mountainWire = new THREE.Mesh(mountainGeo, mountainWireMat);
    mountainWire.rotation.x = -Math.PI / 2.2;
    mountainWire.position.set(0, -7.9, -10);
    scene.add(mountainWire);

    // 4. MOUSE PARALLAX TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. SCROLL / WHEEL SECTION TRANSITION
    let activeIndex = 0;
    let isTransitioning = false;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;

      if (e.deltaY > 30 && activeIndex < sections.length - 1) {
        isTransitioning = true;
        activeIndex++;
        setCurrentSection(activeIndex);

        gsap.to(camera.position, {
          z: 22 - activeIndex * 5,
          y: 2 + activeIndex * 1.5,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            isTransitioning = false;
          },
        });
      } else if (e.deltaY < -30 && activeIndex > 0) {
        isTransitioning = true;
        activeIndex--;
        setCurrentSection(activeIndex);

        gsap.to(camera.position, {
          z: 22 - activeIndex * 5,
          y: 2 + activeIndex * 1.5,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            isTransitioning = false;
          },
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    // 6. RESIZE HANDLER
    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 7. ANIMATION RENDER LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Rotate nebula & mountains
      nebulaParticles.rotation.y = elapsedTime * 0.02 + mouseX * 0.1;
      nebulaParticles.rotation.x = elapsedTime * 0.01 + mouseY * 0.05;

      mountainMesh.rotation.z = Math.sin(elapsedTime * 0.1) * 0.02 + mouseX * 0.05;
      mountainWire.rotation.z = Math.sin(elapsedTime * 0.1) * 0.02 + mouseX * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      particleGeo.dispose();
      particleMat.dispose();
      mountainGeo.dispose();
      mountainMat.dispose();
      mountainWireMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-[#05040a] text-white font-sans border-b border-white/10"
    >
      {/* Full-screen 3D WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
      />

      {/* Background Radial Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d92652]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#8a2be2]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* SIDEBAR FIXED TEXT (SPACE & NAVIGATION) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-6 pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-stone-500 [writing-mode:vertical-lr] rotate-180">
          PROMETHEUS ARCHIVE
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-stone-500/50 to-transparent" />
        <span className="font-mono text-xs text-[#d92652] font-bold">
          0{currentSection + 1}
        </span>
      </div>

      {/* RIGHT SIDE SECTION INDICATOR PINS */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentSection === index
                ? "bg-[#d92652] scale-125 shadow-[0_0_10px_#d92652]"
                : "bg-white/20 hover:bg-white/50"
            }`}
            title={`Section 0${index + 1}`}
          />
        ))}
      </div>

      {/* FLOATING TEXT OVERLAY (DEAD CENTER, POINTER EVENTS NONE) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        
        {sections.map((sec, index) => {
          const isActive = currentSection === index;
          return (
            <div
              key={index}
              className={`transition-all duration-1000 transform max-w-5xl mx-auto ${
                isActive
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-8 absolute pointer-events-none"
              }`}
            >
              {/* Massive Bold Ultra-Thick Title */}
              <h1 className="font-serif font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white via-stone-200 to-stone-400 bg-clip-text text-transparent">
                {sec.title}
              </h1>

              {/* Subtitle Lines */}
              <div className="mt-6 space-y-1">
                <p className="font-sans text-lg sm:text-2xl md:text-3xl text-stone-200 font-light tracking-wide drop-shadow-md">
                  {sec.line1}
                </p>
                <p className="font-sans text-lg sm:text-2xl md:text-3xl text-[#d92652] font-semibold tracking-wide drop-shadow-md">
                  {sec.line2}
                </p>
              </div>

              {/* Action Buttons (Enabled on active section) */}
              {index === 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
                  <Link href="/articles">
                    <button className="px-6 py-3 rounded-xl bg-[#d92652] hover:bg-[#b81d42] text-white text-xs font-bold font-sans transition-all duration-300 shadow-xl flex items-center gap-2 cursor-pointer">
                      <span>تصفح المنشورات الأكاديمية</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </Link>

                  <Link href="/join-us">
                    <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-medium font-sans transition-all duration-300 backdrop-blur-md cursor-pointer">
                      <span>تقديم طلب انضمام</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* BOTTOM SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-auto">
        <button
          onClick={() =>
            setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0))
          }
          className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#d92652]" />
        </button>
      </div>

    </div>
  );
}
