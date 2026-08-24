"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, ChevronDown, Rocket, Compass, BookOpen } from "lucide-react";

interface PrometheusHeroProps {
  heroBadge?: string;
  heroSubtitle?: string;
}

export function PrometheusHero({
  heroBadge = "منصة مؤسسية وأكاديمية تطوعية",
  heroSubtitle = "رؤية الشباب بأسلوب وشغف العلماء — منصة بروميثيوس العلمية والتطوعية للبحث والابتكار.",
}: PrometheusHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. THREE.JS SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050914, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. CREATING 3D PARTICLE GALAXY & HORIZON RING
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const color1 = new THREE.Color(0xe84a0c); // Promethean Amber / Orange
    const color2 = new THREE.Color(0xd49b4b); // Warm Gold
    const color3 = new THREE.Color(0x0284c7); // Cosmic Cyan

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixRatio = Math.random();
      const pColor = mixRatio < 0.5 ? color1.clone().lerp(color2, mixRatio * 2) : color2.clone().lerp(color3, (mixRatio - 0.5) * 2);
      
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;

      scales[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Create custom particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 3. CENTRAL 3D GEOMETRIC HORIZON SPHERE (CORE PROMETHEUS SYMBOL)
    const sphereGeo = new THREE.IcosahedronGeometry(4.5, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xe84a0c,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(coreSphere);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd49b4b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(7.5, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xe84a0c,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    // Orbital Ring 2
    const ringGeo2 = new THREE.TorusGeometry(9.5, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. MOUSE MOVEMENT INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. RESIZE HANDLER
    const handleResize = () => {
      if (!canvas || !container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 6. ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Rotate particles & core
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = elapsedTime * 0.01;

      coreSphere.rotation.y = elapsedTime * 0.15;
      coreSphere.rotation.x = elapsedTime * 0.1;

      innerCore.rotation.y = -elapsedTime * 0.25;
      innerCore.rotation.z = elapsedTime * 0.15;

      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.x = elapsedTime * 0.08;

      // Subtle Camera Parallax
      camera.position.x = mouseX * 2.5;
      camera.position.y = -mouseY * 2.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. GSAP INTRO ANIMATION & TIMELINE
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });

      tl.fromTo(
        logoRef.current,
        { scale: 0.5, opacity: 0, y: -30 },
        { scale: 1, opacity: 1, y: 0, duration: 1.4 }
      )
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8"
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.8"
        );
    }, container);

    // CLEANUP
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      geometry.dispose();
      particleMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative overflow-hidden bg-black text-white font-sans flex flex-col justify-between border-b border-white/10"
    >
      {/* 3D WebGL Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radial Gradient Glow Overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#E84A0C]/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Main Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl pt-16 pb-20 flex-1 flex flex-col justify-center items-center text-center my-auto">
        
        {/* Glassmorphism Outer Container */}
        <div className="w-full backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] space-y-8">
          
          {/* Top Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-[#E84A0C]/40 bg-[#E84A0C]/10 px-4 py-1.5 text-xs font-mono text-[#E84A0C] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E84A0C] animate-spin" />
            <span>{heroBadge}</span>
          </div>

          {/* Prominent Prometheus Logo */}
          <div ref={logoRef} className="flex justify-center my-2">
            <div className="relative p-4 sm:p-6 rounded-3xl bg-[#0D1322]/90 border border-white/15 shadow-2xl backdrop-blur-xl group hover:border-[#E84A0C]/60 transition-all duration-500">
              <Image
                src="/logo-dark.PNG"
                alt="Prometheus Logo"
                width={120}
                height={120}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain filter drop-shadow-[0_10px_30px_rgba(232,74,12,0.4)] group-hover:scale-105 transition-all duration-500"
                priority
              />
            </div>
          </div>

          {/* MAIN PROMETHEUS TITLE & SLOGAN */}
          <div ref={textRef} className="space-y-4 max-w-4xl mx-auto">
            
            {/* Brand Title */}
            <h2 className="text-sm sm:text-base font-mono tracking-[0.3em] uppercase text-[#E84A0C] font-semibold">
              PROMETHEUS PLATFORM
            </h2>

            {/* MASSIVE BRAND SLOGAN */}
            <h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.1] bg-gradient-to-r from-amber-100 via-amber-300 via-orange-400 to-white bg-clip-text text-transparent drop-shadow-md">
              Prometheus, the vision of youth, <br className="hidden sm:inline" />
              the mindset of scientists
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] leading-relaxed font-sans max-w-2xl mx-auto font-normal pt-2">
              {heroSubtitle}
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div ref={ctaRef} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link href="/articles" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 text-sm font-bold bg-[#E84A0C] hover:bg-[#d03e06] text-white rounded-xl shadow-2xl transition-all duration-300 h-12 px-6">
                <span>تصفح منشورات بروميثيوس</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/join-us" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-sm font-medium border-white/15 bg-white/5 text-white hover:text-[#E84A0C] hover:border-[#E84A0C]/50 rounded-xl transition-all duration-300 h-12 px-6 backdrop-blur-md"
              >
                <span>تقديم طلب انضمام</span>
              </Button>
            </Link>
          </div>

        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 pb-6 text-center">
        <a href="#about" className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-[#E84A0C] transition-colors">
          <span>استكشف المنصة</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#E84A0C]" />
        </a>
      </div>

    </div>
  );
}
