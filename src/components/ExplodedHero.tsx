"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface ExplodedHeroProps {
  totalFrames?: number;
}

export function ExplodedHero({ totalFrames = 192 }: ExplodedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentRenderFrameRef = useRef<number>(0);
  const isRenderLoopRunning = useRef<boolean>(false);

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Framer Motion scroll hook bound to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Keep targetFrameRef in sync with scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frameIdx = Math.max(0, Math.min(totalFrames - 1, Math.floor(latest * (totalFrames - 1))));
      targetFrameRef.current = frameIdx;
    });
    return () => unsubscribe();
  }, [scrollYProgress, totalFrames]);

  // High performance preloader with off-thread decode
  useEffect(() => {
    let isMounted = true;
    const loadedImages: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    imagesRef.current = loadedImages;
    let count = 0;

    const framePad = (index: number) => {
      const num = index + 1;
      return num.toString().padStart(4, "0");
    };

    // Helper to load and decode a single frame
    const loadFrame = async (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `/sequence/frame-${framePad(i)}.jpg`;

        const onFinish = () => {
          if (!isMounted) return resolve();
          loadedImages[i] = img;
          count++;
          setLoadedCount(count);
          if (i === 0 || count >= 20) {
            setIsReady(true);
          }
          resolve();
        };

        img.onload = () => {
          onFinish();
        };
        img.onerror = () => {
          if (!isMounted) return resolve();
          count++;
          setLoadedCount(count);
          resolve();
        };

        if (typeof img.decode === "function") {
          img.decode().then(onFinish).catch(() => {});
        }
      });
    };

    // Load key milestone frames first (every 8th frame for instant coarse scrub), then the rest in small batches
    const loadAll = async () => {
      // 1. First frame immediately
      await loadFrame(0);

      // 2. Strided keyframes
      const stride = 8;
      const keyframes: number[] = [];
      for (let i = stride; i < totalFrames; i += stride) {
        keyframes.push(i);
      }
      await Promise.all(keyframes.map((i) => loadFrame(i)));

      // 3. Batch load remaining frames with concurrent workers
      const remaining: number[] = [];
      for (let i = 1; i < totalFrames; i++) {
        if (!loadedImages[i]) {
          remaining.push(i);
        }
      }

      const concurrency = 6;
      let currentIndex = 0;
      const worker = async () => {
        while (currentIndex < remaining.length && isMounted) {
          const idx = remaining[currentIndex++];
          await loadFrame(idx);
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [totalFrames]);

  // Canvas drawing loop with responsive retina scaling and smooth lerp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    isRenderLoopRunning.current = true;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawFrame = (frameIndex: number) => {
      const imgs = imagesRef.current;
      let img = imgs[frameIndex];

      // If specific frame isn't loaded yet, search outward for nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < totalFrames; offset++) {
          if (frameIndex - offset >= 0) {
            const prev = imgs[frameIndex - offset];
            if (prev && prev.complete && prev.naturalWidth > 0) {
              img = prev;
              break;
            }
          }
          if (frameIndex + offset < totalFrames) {
            const next = imgs[frameIndex + offset];
            if (next && next.complete && next.naturalWidth > 0) {
              img = next;
              break;
            }
          }
        }
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Pure dark background matching #060606 to eliminate seams
      ctx.fillStyle = "#060606";
      ctx.fillRect(0, 0, w, h);

      if (img && img.naturalWidth > 0) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const screenRatio = w / h;
        let drawW = w;
        let drawH = h;
        let offsetX = 0;
        let offsetY = 0;

        if (screenRatio > imgRatio) {
          drawH = h;
          drawW = h * imgRatio;
          offsetX = (w - drawW) / 2;
          offsetY = 0;
        } else {
          drawW = w;
          drawH = w / imgRatio;
          offsetX = 0;
          offsetY = (h - drawH) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      }
    };

    const render = () => {
      const target = targetFrameRef.current;
      // High-performance smooth lerp interpolation: faster response (0.24) with zero stutter
      const delta = target - currentRenderFrameRef.current;
      if (Math.abs(delta) < 0.01) {
        currentRenderFrameRef.current = target;
      } else {
        currentRenderFrameRef.current += delta * 0.24;
      }

      const frameToDraw = Math.max(0, Math.min(totalFrames - 1, Math.round(currentRenderFrameRef.current)));
      drawFrame(frameToDraw);

      if (isRenderLoopRunning.current) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRenderLoopRunning.current = false;
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalFrames]);

  // Narrative text overlay transforms
  // Phase 1: 0% - 22%
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.18, 0.24], [1, 1, 0.85, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.24], [0, -35]);

  // Phase 2: 25% - 46%
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.29, 0.43, 0.48], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.29, 0.43, 0.48], [30, 0, 0, -25]);

  // Phase 3: 49% - 74%
  const opacity3 = useTransform(scrollYProgress, [0.49, 0.54, 0.70, 0.75], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.49, 0.54, 0.70, 0.75], [30, 0, 0, -25]);

  // Phase 4: 76% - 100%
  const opacity4 = useTransform(scrollYProgress, [0.77, 0.83, 0.96, 1], [0, 1, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.77, 0.83, 1], [30, 0, 0]);

  // Scroll indicator fade out
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[350vh] bg-[#060606]">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#060606]">
        {/* Full-viewport Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,#060606_95%)] opacity-70" />

        {/* Narrative Overlays during the Pin (Positioned away from center model) */}

        {/* Narrative 1: Assembled (0 - 22%) - Positioned to the Right in RTL */}
        <motion.div
          dir="rtl"
          style={{ opacity: opacity1, y: y1 }}
          className="absolute right-6 sm:right-12 md:right-20 lg:right-24 top-1/2 -translate-y-1/2 max-w-md sm:max-w-lg text-right pointer-events-none z-10"
        >
          <div className="inline-flex items-center space-x-2 space-x-reverse mb-3">
            <span className="w-6 h-[1px] bg-[#C9A05C]/60" />
            <span className="text-[11px] font-sans tracking-wide text-[#C9A05C] font-medium">
              صيانة احترافية للموبايلات، باهتمام بأدق التفاصيل.
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#EDE8E0] leading-[1.2] mb-4">
            Hassan-55
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/80 leading-relaxed font-light mb-6">
            متخصص في فحص وصيانة أعطال الموبايلات الإلكترونية، مع التركيز على تشخيص أعطال البوردة ودوائر الطاقة والشحن والمكونات الدقيقة، وتقديم معلومات واضحة عن المشكلة وخيارات الإصلاح.
          </p>
          <div className="w-12 h-[1px] bg-[#C9A05C]/40" />
        </motion.div>

        {/* Narrative 2: Display & Frame Lifts (25 - 46%) - Positioned to the Left */}
        <motion.div
          dir="rtl"
          style={{ opacity: opacity2, y: y2 }}
          className="absolute left-6 sm:left-12 md:left-20 lg:left-24 top-1/2 -translate-y-1/2 max-w-md sm:max-w-xl text-right pointer-events-none z-10 bg-[#060606]/40 p-4 sm:p-6 backdrop-blur-[2px] border-r border-[#C9A05C]/20"
        >
          <div className="inline-flex items-center space-x-2 space-x-reverse mb-3">
            <span className="w-6 h-[1px] bg-[#C9A05C]/60" />
            <span className="text-[11px] font-sans text-[#C9A05C] tracking-wide font-medium">
              ليه العميل يختار يتعامل معانا؟
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#EDE8E0] leading-snug mb-3">
            التخصص في التفاصيل هو اللي بيصنع الفرق
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/85 leading-relaxed font-light mb-3">
            أنا مؤمن إن الصيانة الصح بتبدأ من فهم المشكلة، مش من تجربة حلول عشوائية. علشان كده، بهتم بـ:
          </p>
          <ul className="text-xs text-[#EDE8E0]/75 space-y-1.5 font-light leading-relaxed mb-4 list-disc list-inside">
            <li><strong className="text-[#C9A05C] font-normal">التشخيص قبل الإصلاح:</strong> تحديد سبب المشكلة قبل اتخاذ قرار الصيانة.</li>
            <li><strong className="text-[#C9A05C] font-normal">الوضوح والمصداقية:</strong> شرح العطل والحلول المتاحة والتكلفة المتوقعة.</li>
            <li><strong className="text-[#C9A05C] font-normal">الاهتمام بالتفاصيل:</strong> التعامل مع مكونات الجهاز بعناية أثناء الفحص والإصلاح.</li>
            <li><strong className="text-[#C9A05C] font-normal">اختبار الجهاز:</strong> مراجعة الوظائف المرتبطة بالإصلاح بعد الانتهاء.</li>
            <li><strong className="text-[#C9A05C] font-normal">الحفاظ على بيانات العميل:</strong> مراعاة خصوصية البيانات وعدم الاطلاع عليها إلا عند الضرورة وبموافقة العميل.</li>
          </ul>
          <div className="pt-3 border-t border-[#C9A05C]/25 text-[11px] font-sans text-[#C9A05C]/90 font-medium">
            خبرة التشخيص تظهر في التفاصيل، مش في تغيير القطع.
          </div>
        </motion.div>

        {/* Narrative 3: Architecture Exposed (49 - 74%) - Positioned to the Right */}
        <motion.div
          dir="rtl"
          style={{ opacity: opacity3, y: y3 }}
          className="absolute right-6 sm:right-12 md:right-20 lg:right-24 top-1/2 -translate-y-1/2 max-w-md sm:max-w-lg text-right pointer-events-none z-10 bg-[#060606]/40 p-4 sm:p-6 backdrop-blur-[2px] border-r border-[#C9A05C]/20"
        >
          <div className="inline-flex items-center space-x-2 space-x-reverse mb-3">
            <span className="w-6 h-[1px] bg-[#C9A05C]/60" />
            <span className="text-[11px] font-mono text-[#C9A05C] tracking-wider uppercase">
              Motherboard Repair
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#EDE8E0] leading-snug mb-3">
            صيانة البوردة
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/80 leading-relaxed font-light mb-3">
            البوردة هي الجزء الرئيسي المسؤول عن الربط بين المكونات والدوائر الإلكترونية داخل الموبايل. بنركز في الخدمة دي على فحص أعطال البوردة وتحديد المكونات أو الدوائر المرتبطة بالمشكلة:
          </p>
          <ul className="text-xs text-[#EDE8E0]/75 space-y-1.5 font-light leading-relaxed mb-4 list-disc list-inside">
            <li>فحص الأعطال الإلكترونية على مستوى البوردة.</li>
            <li>تتبع أسباب توقف الجهاز عن العمل.</li>
            <li>فحص الدوائر والمكونات المتأثرة بالعطل.</li>
            <li>تقييم إمكانية إصلاح المسارات أو المكونات التالفة.</li>
          </ul>
          <p className="text-[11px] text-[#EDE8E0]/65 leading-relaxed font-light mb-3">
            <strong className="text-[#C9A05C] font-normal">الهدف:</strong> تحديد مصدر العطل بدل الاعتماد على تغيير مكونات من غير تشخيص.
          </p>
          <div className="pt-3 border-t border-[#C9A05C]/25 text-[11px] font-sans text-[#C9A05C]/90 font-medium">
            كل دائرة ليها وظيفة، وكل عطل ليه تشخيص
          </div>
        </motion.div>

        {/* Narrative 4: Fully Exploded (76 - 100%) - Shifted Higher within Page Viewport */}
        <motion.div
          dir="rtl"
          style={{ opacity: opacity4, y: y4 }}
          className="absolute inset-x-6 top-[38%] -translate-y-1/2 flex flex-col items-center text-center max-w-2xl mx-auto z-20 pointer-events-auto"
        >
          <span className="text-[11px] font-sans tracking-wide text-[#C9A05C] mb-3 font-medium">
            خلينا نبدأ بتشخيص المشكلة
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#EDE8E0] leading-[1.2] mb-4">
            بتواجه مشكلة في موبايلك؟
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/80 max-w-lg mb-7 leading-relaxed font-light">
            ابعتلنا نوع الجهاز والموديل، ووصف مختصر للعطل والأعراض اللي ظهرت. هنساعدك في تحديد الخطوة المناسبة للفحص ومعرفة إمكانية الإصلاح.
          </p>

          <Link
            href="/service-request"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 border border-[#C9A05C] bg-[#C9A05C]/15 hover:bg-[#C9A05C] text-[#EDE8E0] hover:text-[#060606] transition-all duration-500 ease-luxury text-xs font-medium cursor-pointer"
          >
            <span>سجل طلب الصيانة دلوقتي</span>
            <svg
              className="mr-3 w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-500 ease-luxury"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center pointer-events-none z-10"
        >
          <span className="text-[10px] tracking-widest text-[#EDE8E0]/50 font-sans mb-2">
            Scroll to Disassemble
          </span>
          {!isReady && (
            <span className="text-[9px] font-mono tracking-wider text-[#C9A05C]/60 mb-2">
              جاري فحص المكونات ({Math.round((loadedCount / totalFrames) * 100)}%)
            </span>
          )}
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C9A05C]/60 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
