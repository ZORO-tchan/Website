"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer dir="rtl" className="py-16 bg-[#040404] text-[#EDE8E0] border-t border-[#C9A05C]/15">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
        {/* Logo Badge in Footer */}
        <div className="relative w-14 h-14 mb-4 rounded-full overflow-hidden border border-[#C9A05C]/40 bg-[#060606] shadow-sm">
          <Image
            src="/logo.png"
            alt="Hassan-55 Logo"
            fill
            className="object-cover scale-[1.35]"
          />
        </div>

        <span className="font-serif text-lg tracking-wider text-[#EDE8E0] mb-1">
          Hassan-55
        </span>
        <span className="text-xs text-[#C9A05C]/80 font-sans mb-8">
          صيانة جميع أجهزة الموبايل · تخصص فحص وتشخيص دقيق
        </span>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs text-[#EDE8E0]/60 mb-8">
          <Link href="/" className="hover:text-[#C9A05C] transition-colors duration-300">
            الرئيسية
          </Link>
          <a href="#specifications" className="hover:text-[#C9A05C] transition-colors duration-300">
            مكتبة الأعطال
          </a>
          <Link href="/service-request" className="hover:text-[#C9A05C] transition-colors duration-300">
            تسجيل طلب صيانة
          </Link>
          <a href="https://wa.me/201063577640" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A05C] transition-colors duration-300">
            واتساب: 201063577640+
          </a>
        </div>

        <div className="w-16 h-[1px] bg-[#C9A05C]/20 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-[11px] text-[#EDE8E0]/40 font-sans tracking-wide">
          <span>© جميع الحقوق محفوظة لـ Hassan-55 لصيانة الموبايلات.</span>
          <span className="mt-2 sm:mt-0">تشخيص قبل الإصلاح · خصوصية كاملة لبيانات العميل</span>
        </div>
      </div>
    </footer>
  );
}
