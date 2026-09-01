"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { gsap } from "gsap";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface PrometheusHeroProps {
  heroBadge?: string;
  heroSubtitle?: string;
}

export function PrometheusHero({ heroBadge, heroSubtitle }: PrometheusHeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  activeSectionRef.current = activeSection;

  const isAnimatingRef = useRef(false);
  const touchStartY = useRef(0);

  const totalSections = 2; // Index 0, 1, 2

  const cameraPositions = [
    { x: 0, y: 30, z: 300 },   // Section 0 - PROMETHEUS
    { x: 0, y: 40, z: -50 },   // Section 1 - INNOVATION
    { x: 0, y: 50, z: -700 },  // Section 2 - FUTURE
  ];

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX: number;
    targetCameraY: number;
    targetCameraZ: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
    targetCameraX: cameraPositions[0].x,
    targetCameraY: cameraPositions[0].y,
    targetCameraZ: cameraPositions[0].z,
  });

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });

  // 1. THREE.JS SCENE SETUP (Nebula & Mountain Horizon)
  useEffect(() => {
    if (!canvasRef.current) return;
    const { current: refs } = threeRefs;

    // Scene
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x050814, 0.0004);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    refs.camera.position.set(0, 30, 300);

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield
    const createStarField = () => {
      if (!refs.scene) return;
      const starCount = 4000;
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const choice = Math.random();
          if (choice < 0.6) {
            color.setHSL(0.08, 0.9, 0.6); // Promethean Amber
          } else if (choice < 0.85) {
            color.setHSL(0.95, 0.8, 0.6); // Crimson Red
          } else {
            color.setHSL(0.6, 0.8, 0.7); // Cyan Blue
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.8;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.04 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    // Nebula
    const createNebula = () => {
      if (!refs.scene) return;
      const geometry = new THREE.PlaneGeometry(8000, 4000, 64, 64);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xe84a0c) },
          color2: { value: new THREE.Color(0x8a2be2) },
          opacity: { value: 0.35 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.008 + time) * cos(pos.y * 0.008 + time) * 25.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 8.0 + time) * cos(vUv.y * 8.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.8);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    // Parallax Mountains
    const createMountains = () => {
      if (!refs.scene) return;
      const layers = [
        { distance: -50, height: 60, color: 0x090b14, opacity: 1 },
        { distance: -100, height: 80, color: 0x121024, opacity: 0.85 },
        { distance: -150, height: 100, color: 0x1b1133, opacity: 0.65 },
        { distance: -200, height: 120, color: 0x271242, opacity: 0.45 },
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100;
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene?.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    createStarField();
    createNebula();
    createMountains();

    // Render Animation Loop
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((sf) => {
        if (sf.material instanceof THREE.ShaderMaterial && sf.material.uniforms.time) {
          sf.material.uniforms.time.value = time;
        }
      });

      if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial && refs.nebula.material.uniforms.time) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      if (refs.camera) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor;
      });

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    animate();

    const handleResize = () => {
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.stars.forEach((sf) => {
        sf.geometry.dispose();
        (sf.material as THREE.Material).dispose();
      });
      refs.mountains.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // 2. DISCRETE STEP TRANSITION FUNCTION
  const goToSection = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex > totalSections) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setActiveSection(nextIndex);

    const targetPos = cameraPositions[nextIndex];
    const { current: refs } = threeRefs;
    refs.targetCameraX = targetPos.x;
    refs.targetCameraY = targetPos.y;
    refs.targetCameraZ = targetPos.z;

    // Reset lock timer
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  };

  // 3. EVENT LISTENERS FOR WHEEL AND TOUCH SNAPPING
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      const isAtHeroTop = currentScrollY <= 10;
      const currentSec = activeSectionRef.current;

      // When user is inside Hero Section range
      if (isAtHeroTop) {
        if (e.deltaY > 20) {
          // Scroll Down / Wheel Down
          if (currentSec < totalSections) {
            e.preventDefault();
            goToSection(currentSec + 1);
          }
          // If currentSec === totalSections (Section 2), allow natural scroll down past Hero
        } else if (e.deltaY < -20) {
          // Scroll Up / Wheel Up
          if (currentSec > 0) {
            e.preventDefault();
            goToSection(currentSec - 1);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY; // Positive = Swipe Up (Scroll Down)
      const currentScrollY = window.scrollY;
      const isAtHeroTop = currentScrollY <= 10;
      const currentSec = activeSectionRef.current;

      if (isAtHeroTop && Math.abs(deltaY) > 40) {
        if (deltaY > 0) {
          // Swipe Up / Scroll Down
          if (currentSec < totalSections) {
            goToSection(currentSec + 1);
          }
        } else {
          // Swipe Down / Scroll Up
          if (currentSec > 0) {
            goToSection(currentSec - 1);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const sectionData = [
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

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-[#050814] text-white font-sans border-b border-white/10"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
      />

      {/* Ambient Gradient Glow Overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e84a0c]/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#8a2be2]/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* SIDEBAR FIXED TEXT */}
      <div
        ref={menuRef}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-6 pointer-events-none"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-stone-400 [writing-mode:vertical-lr] rotate-180 font-bold">
          PROMETHEUS ARCHIVE
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#e84a0c] to-transparent" />
        <span className="font-mono text-xs text-[#e84a0c] font-bold">
          0{activeSection + 1}
        </span>
      </div>

      {/* RIGHT SIDE DOT INDICATORS */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        {sectionData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSection === index
                ? "bg-[#e84a0c] scale-125 shadow-[0_0_12px_#e84a0c]"
                : "bg-white/20 hover:bg-white/60"
            }`}
            title={`Section 0${index + 1}`}
          />
        ))}
      </div>

      {/* FLOATING TEXT OVERLAY (DEAD CENTER, POINTER EVENTS NONE) */}
      <div
        ref={textContainerRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
      >
        {sectionData.map((sec, index) => {
          const isActive = activeSection === index;
          return (
            <div
              key={index}
              className={`transition-all duration-700 transform max-w-5xl mx-auto ${
                isActive
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-8 absolute pointer-events-none"
              }`}
            >
              {/* Massive Bold Title */}
              <h1 className="font-serif font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-white uppercase leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] bg-gradient-to-b from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
                {sec.title}
              </h1>

              {/* Subtitles */}
              <div className="mt-4 space-y-1.5">
                <p className="font-sans text-xl sm:text-3xl font-semibold tracking-wide text-[#e84a0c] drop-shadow-lg">
                  {sec.line1}
                </p>
                <p className="font-sans text-xl sm:text-3xl font-normal tracking-wide text-white drop-shadow-lg">
                  {sec.line2}
                </p>
              </div>

              {/* Action Buttons for Section 0 */}
              {index === 0 && (
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
                  <Link
                    href="/activities"
                    className="px-6 py-3 rounded-xl bg-[#e84a0c] hover:bg-[#c83d08] text-white text-xs font-bold font-sans transition-all duration-300 shadow-2xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>استكشف الأنشطة والدورات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/join-us"
                    className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs font-medium font-sans transition-all duration-300 backdrop-blur-md cursor-pointer"
                  >
                    <span>تقديم طلب انضمام</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM SCROLL PROGRESS INDICATOR */}
      <div
        ref={scrollProgressRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto"
      >
        <button
          onClick={() =>
            goToSection(activeSection < totalSections ? activeSection + 1 : 0)
          }
          className="flex items-center gap-3 text-[11px] font-mono text-stone-300 cursor-pointer hover:text-white transition-colors"
        >
          <span className="uppercase tracking-widest text-[#e84a0c] font-bold">
            {activeSection < totalSections ? "NEXT SLIDE" : "EXPLORE MORE"}
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e84a0c] transition-all duration-500"
              style={{
                width: `${((activeSection + 1) / (totalSections + 1)) * 100}%`,
              }}
            />
          </div>
          <span>
            0{activeSection + 1} / 0{totalSections + 1}
          </span>
        </button>

        <ChevronDown className="w-4 h-4 animate-bounce text-[#e84a0c]" />
      </div>
    </div>
  );
}
