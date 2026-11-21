"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();

    // Camera with cinematic perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Studio Lighting (Inspired by Apple product cinematography)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Top-right Key Light (Neutral Daylight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // Bottom-left Rim Light (Titanium cold specular)
    const rimLight = new THREE.DirectionalLight(0xb0b5c0, 2.0);
    rimLight.position.set(-5, -4, -4);
    scene.add(rimLight);

    // Subtle safety orange specular highlight (very gentle, not neon)
    const accentLight = new THREE.PointLight(0xff5722, 1.2, 12);
    accentLight.position.set(2, -3, 3);
    scene.add(accentLight);

    // -------------------------------------------------------------------------
    // Precision Olympic Dumbbell Assembly (Eleiko / Architectural Inspiration)
    // -------------------------------------------------------------------------
    const dumbbellGroup = new THREE.Group();

    // High-End Materials
    const titaniumPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x222226,
      metalness: 0.85,
      roughness: 0.3,
    });

    const brushedChromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.18,
    });

    const knurledGripMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      metalness: 0.92,
      roughness: 0.45, // Tactile grip texture
    });

    const precisionCollarMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Minimalist brand electric lime green ring
      metalness: 0.7,
      roughness: 0.25,
    });

    // 1. Central Handle with Knurled Texture Bands
    const handleGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 48);
    const handleMesh = new THREE.Mesh(handleGeo, knurledGripMaterial);
    handleMesh.rotation.z = Math.PI / 2;
    dumbbellGroup.add(handleMesh);

    // Center laser-engraved indicator ring
    const centerRingGeo = new THREE.TorusGeometry(0.128, 0.015, 16, 48);
    const centerRing = new THREE.Mesh(centerRingGeo, precisionCollarMaterial);
    centerRing.rotation.y = Math.PI / 2;
    dumbbellGroup.add(centerRing);

    // Function to build Olympic weight stacks
    const buildPlateStack = (multiplier: number) => {
      const stack = new THREE.Group();
      stack.position.x = 1.35 * multiplier;

      // Shaft Collar
      const collarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 48);
      const collar = new THREE.Mesh(collarGeo, precisionCollarMaterial);
      collar.rotation.z = Math.PI / 2;
      collar.position.x = 0.04 * multiplier;
      stack.add(collar);

      // Plate 1: 20kg Heavy Cast Titanium Plate
      const p1Geo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 64);
      const p1 = new THREE.Mesh(p1Geo, titaniumPlateMaterial);
      p1.rotation.z = Math.PI / 2;
      p1.position.x = 0.22 * multiplier;
      stack.add(p1);

      // Plate 1 Precision Chamfered Rim
      const rim1Geo = new THREE.TorusGeometry(0.89, 0.035, 16, 64);
      const rim1 = new THREE.Mesh(rim1Geo, brushedChromeMaterial);
      rim1.rotation.y = Math.PI / 2;
      rim1.position.x = 0.22 * multiplier;
      stack.add(rim1);

      // Plate 2: 15kg Mid Plate
      const p2Geo = new THREE.CylinderGeometry(0.76, 0.76, 0.16, 64);
      const p2 = new THREE.Mesh(p2Geo, titaniumPlateMaterial);
      p2.rotation.z = Math.PI / 2;
      p2.position.x = 0.44 * multiplier;
      stack.add(p2);

      // Plate 3: 10kg Outer Plate
      const p3Geo = new THREE.CylinderGeometry(0.62, 0.62, 0.14, 64);
      const p3 = new THREE.Mesh(p3Geo, titaniumPlateMaterial);
      p3.rotation.z = Math.PI / 2;
      p3.position.x = 0.62 * multiplier;
      stack.add(p3);

      // Outer Machined Steel Retaining Cap
      const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 48);
      const cap = new THREE.Mesh(capGeo, brushedChromeMaterial);
      cap.rotation.z = Math.PI / 2;
      cap.position.x = 0.74 * multiplier;
      stack.add(cap);

      return stack;
    };

    dumbbellGroup.add(buildPlateStack(1));
    dumbbellGroup.add(buildPlateStack(-1));

    // Stately initial architectural posture
    dumbbellGroup.rotation.z = 0.35;
    dumbbellGroup.rotation.y = -0.4;
    scene.add(dumbbellGroup);

    // Subtle, architectural kinetic ring (Precision calibrated measurement orbit)
    const ringGeo = new THREE.TorusGeometry(2.3, 0.012, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x44444a,
      transparent: true,
      opacity: 0.4,
    });
    const precisionRing = new THREE.Mesh(ringGeo, ringMat);
    precisionRing.rotation.x = Math.PI / 2.8;
    scene.add(precisionRing);

    // Mouse Interaction with Smooth Physical Damping
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia
      currentX += (mouseX - currentX) * 0.035;
      currentY += (mouseY - currentY) * 0.035;

      // Subtle, confident rotation
      dumbbellGroup.rotation.y = -0.4 + currentX * 0.5 + Math.sin(elapsedTime * 0.5) * 0.08;
      dumbbellGroup.rotation.x = currentY * 0.35 + Math.cos(elapsedTime * 0.4) * 0.05;
      dumbbellGroup.rotation.z = 0.35 + Math.sin(elapsedTime * 0.3) * 0.04;
      dumbbellGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.1;

      // Slow precision ring rotation
      precisionRing.rotation.z = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      handleGeo.dispose();
      centerRingGeo.dispose();
      ringGeo.dispose();
      brushedChromeMaterial.dispose();
      titaniumPlateMaterial.dispose();
      knurledGripMaterial.dispose();
      precisionCollarMaterial.dispose();
      ringMat.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] flex items-center justify-center">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Editorial Telemetry Micro-Indicator */}
      <div className="absolute bottom-3 right-4 px-3 py-1 rounded-sm border border-white/[0.08] bg-[#0b0b0d]/90 text-[10px] mono-label flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
        <span>3D PRECISION RIG • LERP INTERACTION</span>
      </div>
    </div>
  );
}
