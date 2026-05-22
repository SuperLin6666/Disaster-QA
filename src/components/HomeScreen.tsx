/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Play, ShieldAlert, Award } from "lucide-react";
import { Chapter } from "../types";

interface HomeScreenProps {
  key?: string;
  chapters: Chapter[];
  onStartQuiz: () => void;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
}

export default function HomeScreen({
  chapters,
  onStartQuiz,
  totalScore,
  totalCorrect,
  totalQuestions,
}: HomeScreenProps) {
  return (
    <motion.div
      id="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, exit: -15 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center min-h-screen sm:h-screen px-4 py-4 sm:py-6 text-center bg-radial from-amber-500/5 via-transparent to-transparent z-10 overflow-hidden"
    >
      {/* Radar sweep background indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,92vw)] h-[min(480px,92vw)] rounded-full border border-orange-500/10 pointer-events-none">
        <div className="absolute inset-[15%] rounded-full border border-orange-500/5" />
        <div className="absolute inset-[30%] rounded-full border border-orange-500/5" />
        <div className="absolute inset-0 rounded-full bg-conic from-transparent via-orange-500/5 to-transparent animate-[spin_4s_linear_infinite]" />
      </div>

      <div className="relative max-w-xl mx-auto z-10 flex flex-col items-center">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/35 bg-orange-500/10 text-orange-500 font-extrabold text-[10px] tracking-[2.5px] uppercase mb-4 sm:mb-6"
        >
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          防災演練系統 READY
        </motion.div>

        {/* Title */}
        <h1 className="font-ops text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-wider mb-4 flex flex-col gap-1">
          <span className="text-gray-100 flex items-center justify-center gap-2">
            <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-orange-500 animate-[bounce_2s_infinite]" />
            災害應變
          </span>
          <span className="text-orange-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]">
            生存大挑戰
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.4em] text-white/20 mt-1">
            SURVIVAL QUIZ PLATFORM
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm font-semibold leading-relaxed max-w-md mb-4 sm:mb-6">
          應對大自然危機，挑戰 4 種極端災害、20 道情境題目。
          <br />
          學習黃金防護觀念，與時間賽跑，成為真正的災害防護專家！
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8 max-w-sm">
          {chapters.map((ch) => (
            <span
              key={ch.id}
              className="px-3 py-1 rounded-lg text-xs font-extrabold border bg-gray-950/40 hover:scale-105 transition-transform"
              style={{ borderColor: ch.color, color: ch.color }}
            >
              {ch.emoji} {ch.titleZh}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            id="start-challenge-btn"
            onClick={onStartQuiz}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-base text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_6px_25px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            ⚡ 立即開始安全演練
          </button>

          {totalQuestions > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mt-1 bg-gray-900/40 px-3 py-1 rounded-full border border-white/5">
              <Award className="w-3.5 h-3.5 text-orange-400" />
              <span>
                歷史紀錄：{totalCorrect} / {totalQuestions} 答對・累計 {totalScore} 分
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
