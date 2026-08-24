"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PrometheusHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;
  
  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  });

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const { current: refs } = threeRefs;
    
    // Scene setup
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x050814, 0.0004);

    // Camera setup
    refs.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    refs.camera.position.z = 100;
    refs.camera.position.y = 20;

    // Renderer setup
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield Creator
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
          const colorChoice = Math.random();
          if (colorChoice < 0.6) {
            color.setHSL(0.08, 0.9, 0.6); // Promethean Amber
          } else if (colorChoice < 0.85) {
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

    // Nebula Creator
    const createNebula = () => {
      if (!refs.scene) return;
      const geometry = new THREE.PlaneGeometry(8000, 4000, 64, 64);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xe84a0c) }, // Promethean Amber
          color2: { value: new THREE.Color(0x8a2be2) }, // Deep Purple
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

    // Parallax Mountain Creator
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
        refs.scene.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    createStarField();
    createNebula();
    createMountains();

    // Store Mountain Locations
    const locations: number[] = [];
    refs.mountains.forEach((m, i) => {
      locations[i] = m.position.z;
    });
    refs.locations = locations;

    // Animation Loop
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if (starField.material instanceof THREE.ShaderMaterial && starField.material.uniforms.time) {
          starField.material.uniforms.time.value = time;
        }
      });

      if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial && refs.nebula.material.uniforms.time) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothingFactor;
        
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
    setIsReady(true);

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

  // GSAP Entrance Animation
  useEffect(() => {
    if (!isReady) return;
    
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: "visible",
    });

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    if (titleRef.current) {
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      }, "-=0.5");
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8");
    }

    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll Tracking & Camera Transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(documentHeight - windowHeight, 1);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      
      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * (totalSections + 1)), totalSections);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;
      
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },   // Section 0 - PROMETHEUS
        { x: 0, y: 40, z: -50 },   // Section 1 - INNOVATION
        { x: 0, y: 50, z: -700 },  // Section 2 - FUTURE
      ];
      
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = targetZ + progress * speed * 0.01 - 100;
        }
        
        if (progress > 0.75) {
          mountain.position.z = 600000;
        } else if (refs.locations && refs.locations[i] !== undefined) {
          mountain.position.z = refs.locations[i];
        }
      });
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections]);

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

  const currentData = sectionData[currentSection] || sectionData[0];

  return (
    <div
      ref={containerRef}
      className="w-full h-[300vh] relative bg-[#050814] text-white font-sans"
    >
      {/* STICKY SCREEN WRAPPER */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
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
          style={{ visibility: "hidden" }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-6 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-stone-400 [writing-mode:vertical-lr] rotate-180 font-bold">
            PROMETHEUS ARCHIVE
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#e84a0c] to-transparent" />
          <span className="font-mono text-xs text-[#e84a0c] font-bold">
            0{currentSection + 1}
          </span>
        </div>

        {/* FLOATING TEXT OVERLAY (DEAD CENTER) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 my-auto">
          <div className="max-w-5xl mx-auto space-y-4 transition-all duration-700">
            
            {/* Massive Bold Title */}
            <h1
              ref={titleRef}
              style={{ visibility: "hidden" }}
              className="font-serif font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-white uppercase leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] bg-gradient-to-b from-white via-amber-100 to-amber-400 bg-clip-text text-transparent"
            >
              {currentData.title}
            </h1>

            {/* Subtitles */}
            <div
              ref={subtitleRef}
              style={{ visibility: "hidden" }}
              className="space-y-1.5"
            >
              <p className="font-sans text-xl sm:text-3xl font-semibold tracking-wide text-[#e84a0c] drop-shadow-lg">
                {currentData.line1}
              </p>
              <p className="font-sans text-xl sm:text-3xl font-normal tracking-wide text-white drop-shadow-lg">
                {currentData.line2}
              </p>
            </div>

            {/* Action Buttons for Section 0 */}
            {currentSection === 0 && (
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
                <Link href="/articles">
                  <button className="px-6 py-3 rounded-xl bg-[#e84a0c] hover:bg-[#c83d08] text-white text-xs font-bold font-sans transition-all duration-300 shadow-2xl flex items-center gap-2 cursor-pointer">
                    <span>تصفح المنشورات الأكاديمية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </Link>

                <Link href="/join-us">
                  <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs font-medium font-sans transition-all duration-300 backdrop-blur-md cursor-pointer">
                    <span>تقديم طلب انضمام</span>
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SCROLL PROGRESS INDICATOR */}
        <div
          ref={scrollProgressRef}
          style={{ visibility: "hidden" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto"
        >
          <div className="flex items-center gap-3 text-[11px] font-mono text-stone-300">
            <span className="uppercase tracking-widest text-[#e84a0c]">SCROLL</span>
            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e84a0c] transition-all duration-150"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span>
              0{currentSection + 1} / 0{totalSections + 1}
            </span>
          </div>

          <ChevronDown className="w-4 h-4 animate-bounce text-[#e84a0c]" />
        </div>

      </div>
    </div>
  );
}
