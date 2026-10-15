"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function ServiceRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    deviceBrand: "",
    deviceModel: "",
    faultCategory: "أعطال بوردة ودوائر طاقة (الجهاز قاطع باور)",
    issueDescription: "",
    previousRepairAttempt: "لا، لم يتم فتحه من قبل (حالة المصنع)",
  });

  // Prepare full formatted message for WhatsApp
  const generateMessage = (refId?: string) => {
    return (
      `*طلب صيانة جديد [${refId || "Hassan-55"}]:*\n\n` +
      `👤 *الاسم:* ${formData.name}\n` +
      `📱 *رقم الهاتف:* ${formData.phone}\n` +
      `🔧 *الجهاز والموديل:* ${formData.deviceBrand} - ${formData.deviceModel || "غير محدد"}\n` +
      `🔍 *تصنيف العطل:* ${formData.faultCategory}\n` +
      `⚙️ *هل تم فتحه مسبقاً:* ${formData.previousRepairAttempt}\n` +
      `📝 *وصف المشكلة والأعراض:* ${formData.issueDescription}\n\n` +
      `_تم إرسال هذا الطلب عبر موقع صيانة Hassan-55_`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let generatedOrderId = `H55-${Date.now().toString().slice(-6)}`;

    try {
      // 1. Save order internally in site system / database
      const res = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.orderId) {
        generatedOrderId = data.orderId;
      }
    } catch {
      // continues even if offline
    }

    setOrderRef(generatedOrderId);
    setLoading(false);
    setSubmitted(true);

    // 2. Automatically dispatch directly to user's WhatsApp to send from their phone number
    const msg = generateMessage(generatedOrderId);
    const whatsappUrl = `https://wa.me/201063577640?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp in a clean tab or app
    window.open(whatsappUrl, "_blank");
  };

  const handleCopy = () => {
    const text = generateMessage(orderRef);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#060606] text-[#EDE8E0] relative selection:bg-[#C9A05C]/20 selection:text-[#EDE8E0]">
      <div className="grain-overlay" />
      <Header />

      <div className="pt-32 sm:pt-40 pb-28 px-6 sm:px-12 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#EDE8E0]/50 font-sans">
          <Link href="/" className="hover:text-[#C9A05C] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-[#C9A05C]">تسجيل طلب صيانة</span>
        </div>

        {/* Page Hero */}
        <div className="mb-14">
          <span className="text-xs font-sans tracking-wide text-[#C9A05C] mb-3 block font-medium">
            مركز فحص وصيانة الموبايلات الإلكترونية
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#EDE8E0] tracking-wide mb-4">
            تسجيل طلب صيانة جهاز
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/70 max-w-2xl font-light leading-relaxed">
            بمجرد إدخال البيانات والضغط على &quot;إرسال الطلب&quot;، سيتم حفظ الطلب فوراً في نظام الموقع وتحويلك تلقائياً لإرساله كرسالة مباشرة من رقمك عبر واتساب إلى الفني.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submitted ? (
          <div className="p-8 sm:p-14 border border-[#C9A05C]/40 bg-[#090909] text-center space-y-6">
            <span className="w-16 h-16 rounded-full border border-[#C9A05C] inline-flex items-center justify-center text-[#C9A05C] text-3xl font-serif mb-2">
              ✓
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#EDE8E0]">
              تم تسجيل وحفظ طلبك بنجاح
            </h2>
            <div className="inline-block px-4 py-1.5 border border-[#C9A05C]/30 bg-[#060606] text-xs font-mono text-[#C9A05C]">
              رقم تتبع الطلب: {orderRef}
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#EDE8E0]/80 max-w-lg mx-auto leading-relaxed">
              تم حفظ نسختك في سجل الموقع وفتح محادثة واتساب لإرسال التفاصيل كاملة مباشرة من حسابك.
            </p>

            {/* Methods to connect */}
            <div className="pt-4 max-w-xl mx-auto space-y-3">
              <span className="text-[11px] text-[#C9A05C] font-sans block mb-2 font-medium">
                طرق المتابعة والتأكيد المتاحة:
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1. Direct WhatsApp */}
                <a
                  href={`https://wa.me/201063577640?text=${encodeURIComponent(generateMessage(orderRef))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#C9A05C] hover:bg-[#DFC085] text-[#060606] font-medium text-xs font-sans transition-all flex items-center justify-center gap-2"
                >
                  <span>إعادة فتح رسالة الواتساب</span>
                </a>

                {/* 2. Direct Call */}
                <a
                  href="tel:+201063577640"
                  className="w-full sm:w-auto px-6 py-3 border border-[#C9A05C]/40 hover:border-[#C9A05C] text-[#EDE8E0] hover:text-[#C9A05C] text-xs font-sans transition-all flex items-center justify-center gap-2"
                >
                  <span>الاتصال المباشر بالفني</span>
                </a>

                {/* 3. Copy Details Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-6 py-3 border border-[#EDE8E0]/20 hover:border-[#C9A05C] text-[#EDE8E0] text-xs font-sans transition-all"
                >
                  {copied ? "تم نسخ التفاصيل بنجاح ✓" : "نسخ تفاصيل الطلب"}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EDE8E0]/10 flex justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#EDE8E0]/50 hover:text-[#C9A05C] transition-colors"
              >
                + تسجيل طلب لجهاز آخر
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8 bg-[#090909]/90 p-8 sm:p-12 border border-[#C9A05C]/20">
              <div className="flex items-center justify-between pb-4 border-b border-[#C9A05C]/15">
                <h2 className="text-base font-serif text-[#EDE8E0]">
                  بيانات العميل والجهاز
                </h2>
                <span className="text-[11px] text-[#C9A05C] font-mono">
                  خطوة 1 من 1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسمك الكريم"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-sm py-2.5 px-2 outline-none transition-colors duration-300 font-sans"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    رقم الهاتف (المرتبط بالواتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-sm py-2.5 px-2 outline-none transition-colors duration-300 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    الشركة المصنعة (ماركة الجهاز) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: Apple, Samsung, Xiaomi, Oppo..."
                    value={formData.deviceBrand}
                    onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-sm py-2.5 px-2 outline-none transition-colors duration-300 font-sans"
                  />
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    الموديل بالتحديد
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: iPhone 13 Pro Max / S23 Ultra"
                    value={formData.deviceModel}
                    onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-sm py-2.5 px-2 outline-none transition-colors duration-300 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    التصنيف الأقرب للمشكلة
                  </label>
                  <select
                    value={formData.faultCategory}
                    onChange={(e) => setFormData({ ...formData, faultCategory: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-xs py-2.5 px-1 outline-none transition-colors duration-300 font-sans cursor-pointer"
                  >
                    <option className="bg-[#060606] text-[#EDE8E0]">أعطال بوردة ودوائر طاقة (الجهاز قاطع باور)</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">تعرض الجهاز للماء أو السوائل والأكسدة</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">مشاكل الشحن والحرارة غير الطبيعية</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">مشاكل الشبكة والواي فاي والصوت</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">عطل آخر / فحص عام وتشخيص</option>
                  </select>
                </div>

                {/* Previous attempts */}
                <div className="space-y-2">
                  <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                    هل تم فحص الجهاز أو فتحه من قبل؟
                  </label>
                  <select
                    value={formData.previousRepairAttempt}
                    onChange={(e) => setFormData({ ...formData, previousRepairAttempt: e.target.value })}
                    className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-xs py-2.5 px-1 outline-none transition-colors duration-300 font-sans cursor-pointer"
                  >
                    <option className="bg-[#060606] text-[#EDE8E0]">لا، لم يتم فتحه من قبل (حالة المصنع)</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">نعم، تم فتحه أو محاولة صيانته سابقاً</option>
                    <option className="bg-[#060606] text-[#EDE8E0]">غير متأكد</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs text-[#C9A05C] font-sans block font-medium">
                  وصف المشكلة والأعراض التي ظهرت بالتفصيل *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="يرجى ذكر كيفية حدوث العطل (فجأة، أثناء الشحن، بعد سقوط، بعد تعرض لسائل) وأي أعراض تلاحظها..."
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  className="w-full bg-[#060606] border-b border-[#C9A05C]/30 focus:border-[#C9A05C] text-[#EDE8E0] text-sm py-2.5 px-2 outline-none transition-colors duration-300 font-sans resize-none"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[11px] text-[#EDE8E0]/50 font-light font-sans max-w-sm">
                  بمجرد الضغط سيتم تسجيل الطلب وفتح رسالة واتساب جاهزة مباشرة من رقمك إلى الفني.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-3.5 bg-[#C9A05C] hover:bg-[#DFC085] disabled:opacity-50 text-[#060606] font-medium text-xs font-sans transition-all duration-400"
                >
                  {loading ? "جاري الإرسال والتسجيل..." : "إرسال طلب الصيانة والتحويل لواتساب"}
                </button>
              </div>
            </form>

            {/* Sidebar Guidelines */}
            <div className="lg:col-span-4 space-y-6">
              {/* Box 1: Why Us */}
              <div className="p-6 bg-[#090909]/60 border border-[#C9A05C]/20 space-y-4">
                <span className="text-[11px] text-[#C9A05C] font-sans font-medium block">
                  ميثاق العمل في Hassan-55
                </span>
                <ul className="text-xs text-[#EDE8E0]/70 space-y-2.5 font-light leading-relaxed list-disc list-inside">
                  <li><strong>فحص قبل اتخاذ القرار:</strong> لا يتم تغيير أي قطعة إلا بعد قياس وتأكيد العطل.</li>
                  <li><strong>وضوح التكلفة:</strong> إبلاغ العميل بتقرير الفحص والتكلفة قبل البدء بأي إصلاح.</li>
                  <li><strong>حماية الخصوصية:</strong> بيانات العميل ومحتوياته الشخصية مصانة تماماً دون أي مساس.</li>
                </ul>
              </div>

              {/* Box 2: Direct Contact */}
              <div className="p-6 bg-[#090909]/60 border border-[#C9A05C]/20 space-y-4">
                <span className="text-[11px] text-[#C9A05C] font-sans font-medium block">
                  أرقام التواصل المباشرة
                </span>
                <p className="text-xs text-[#EDE8E0]/65 leading-relaxed font-light">
                  يمكنك أيضاً الاتصال الفوري أو المراسلة عبر:
                </p>
                <div className="space-y-2.5 pt-2">
                  <a
                    href="https://wa.me/201063577640"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-mono text-[#EDE8E0] hover:text-[#C9A05C] transition-colors"
                  >
                    واتساب: <span dir="ltr">+20 106 357 7640</span>
                  </a>
                  <a
                    href="tel:+201063577640"
                    className="block text-xs font-mono text-[#EDE8E0] hover:text-[#C9A05C] transition-colors"
                  >
                    محمول: <span dir="ltr">+20 106 357 7640</span>
                  </a>
                  <a
                    href="tel:+201144861883"
                    className="block text-xs font-mono text-[#EDE8E0] hover:text-[#C9A05C] transition-colors"
                  >
                    محمول: <span dir="ltr">+20 114 486 1883</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
