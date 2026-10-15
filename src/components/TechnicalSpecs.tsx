"use client";

import React from "react";
import { motion } from "framer-motion";

interface FaultItem {
  fault: string;
  cause: string;
}

const faultsData: FaultItem[] = [
  {
    fault: "الموبايل لا يعمل نهائيًا",
    cause:
      "عدم تشغيل الجهاز ممكن يرتبط بالبطارية أو مدخل الشحن أو دوائر الطاقة أو أعطال أخرى على البوردة. التشخيص بيبدأ بفحص الحالة العامة للجهاز، ثم تنفيذ القياسات المناسبة لتحديد مصدر المشكلة المحتمل.",
  },
  {
    fault: "أكسدة البوردة: هل التنظيف كفاية؟",
    cause:
      "ده بيتحدد حسب مكان الأكسدة وشدتها، ومدى تأثر المسارات والمكونات. في بعض الحالات التنظيف بيكون جزءًا من الإصلاح، وفي حالات تانية بيكون فيه مكونات تالفة تحتاج إلى معالجة إضافية.",
  },
  {
    fault: "البوردة ممكن تتصلح بدل ما تتغير",
    cause:
      "في حالات كتير ممكن إصلاح مكون أو مسار على البوردة بس ده مش ممكن في كل الحالات، دا بيعتمد على مكان التلف وشدته وحالة البوردة العامة.",
  },
];

export function TechnicalSpecs() {
  return (
    <section id="specifications" dir="rtl" className="relative py-28 sm:py-36 bg-[#060606] hairline-t hairline-b">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div>
            <span className="text-[11px] font-sans tracking-wide text-[#C9A05C] block mb-2 font-medium">
              الأعطال
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#EDE8E0]">
              مكتبة الأعطال
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-sans text-xs tracking-wider text-[#EDE8E0]/60 max-w-xs md:text-left">
            شرح المشكلة بطريقة مفهومة
          </p>
        </div>

        {/* 2-Column Table Without Borders */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-[#C9A05C]/20 text-xs font-sans text-[#C9A05C] font-medium">
            <div className="md:col-span-4">العطل</div>
            <div className="md:col-span-8">السبب المحتمل في العطل وسبل التشخيص</div>
          </div>

          <div className="divide-y divide-transparent">
            {faultsData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start transition-colors duration-300 hover:bg-[#C9A05C]/[0.02] px-2 sm:px-4 rounded-none"
              >
                <div className="md:col-span-4 font-serif text-base sm:text-lg text-[#EDE8E0] leading-snug">
                  {item.fault}
                </div>
                <div className="md:col-span-8 text-xs sm:text-sm font-light text-[#EDE8E0]/75 font-sans leading-relaxed">
                  {item.cause}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footnote Stamp */}
        <div className="mt-16 pt-8 border-t border-[#C9A05C]/15 text-xs text-[#EDE8E0]/60 font-sans leading-relaxed">
          <p className="text-center md:text-right">
            كل جهاز له تصميم إلكتروني ومكونات وطريقة فحص مختلفة، علشان كده بنراعي اختلاف الموديل وطبيعة العطل في تحديد أسلوب التشخيص والإصلاح.
          </p>
        </div>
      </div>
    </section>
  );
}
