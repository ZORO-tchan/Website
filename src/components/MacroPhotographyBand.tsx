"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function MacroPhotographyBand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scaleParallax = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.0, 1.05]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full py-28 sm:py-36 overflow-hidden bg-[#060606] flex items-center justify-center border-t border-[#C9A05C]/15"
    >
      {/* Parallax Background Canvas / Imagery using high-resolution macro frame */}
      <motion.div
        style={{ y: yParallax, scale: scaleParallax }}
        className="absolute inset-0 w-full h-[125%] -top-[12.5%]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sequence/frame-0095.jpg"
          alt="Macro detail"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/75 to-[#060606]" />
      </motion.div>

      {/* Floating Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-sans tracking-wide text-[#C9A05C] mb-4 block font-medium">
          محتوى تقني لفهم الأعطال بشكل أعمق
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-[#EDE8E0] leading-snug mb-6 max-w-2xl mx-auto">
          المحتوى الفني هدفه تبسيط المفاهيم وتبادل المعرفة، مع مراعاة اختلاف تصميم الأجهزة والموديلات.
        </h3>

        {/* Direct Contact Options */}
        <div className="mt-10 pt-8 border-t border-[#C9A05C]/25 max-w-xl mx-auto">
          <p className="text-xs text-[#EDE8E0]/60 font-sans mb-6">
            للتواصل المباشر والاستفسار الفني:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/201063577640"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-[#C9A05C] bg-[#C9A05C]/10 hover:bg-[#C9A05C] text-[#EDE8E0] hover:text-[#060606] transition-all duration-400 font-sans text-xs"
            >
              <span className="font-mono text-sm tracking-wide ml-2" dir="ltr">+20 106 357 7640</span>
              <span className="font-medium">واتساب</span>
            </a>

            {/* Phone 1 */}
            <a
              href="tel:+201063577640"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-[#EDE8E0]/20 hover:border-[#C9A05C] bg-[#060606]/60 text-[#EDE8E0] hover:text-[#C9A05C] transition-all duration-400 font-sans text-xs"
            >
              <span className="font-mono text-sm tracking-wide ml-2" dir="ltr">+20 106 357 7640</span>
              <span className="font-medium">محمول</span>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:+201144861883"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-[#EDE8E0]/20 hover:border-[#C9A05C] bg-[#060606]/60 text-[#EDE8E0] hover:text-[#C9A05C] transition-all duration-400 font-sans text-xs"
            >
              <span className="font-mono text-sm tracking-wide ml-2" dir="ltr">+20 114 486 1883</span>
              <span className="font-medium">محمول</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
