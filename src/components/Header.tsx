"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-luxury ${
        scrolled
          ? "bg-[#060606]/85 backdrop-blur-md border-b border-[#C9A05C]/15 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 text-right transition-opacity duration-300 hover:opacity-85"
        >
          {/* Logo Circular Badge */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#C9A05C]/40 bg-[#060606] shadow-sm flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Hassan-55 Logo"
              fill
              className="object-cover scale-[1.35]"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="font-serif tracking-[0.12em] text-base sm:text-lg font-semibold text-[#EDE8E0] leading-tight">
              Hassan-55
            </span>
            <span className="text-[11px] tracking-wide text-[#C9A05C]/80 font-sans mt-0.5">
              صيانة جميع أجهزة الموبايل
            </span>
          </div>
        </Link>

        {/* Single Navigation Action */}
        <nav className="flex items-center">
          <Link
            href="/service-request"
            className="group relative inline-flex items-center text-xs tracking-wider font-sans text-[#EDE8E0] py-2 px-5 border border-[#C9A05C]/40 hover:border-[#C9A05C] transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 bg-[#C9A05C]/15 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury"></span>
            <span className="relative z-10 text-[#C9A05C] group-hover:text-[#EDE8E0] transition-colors duration-300 font-medium">
              تسجيل طلب صيانة
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
