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
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center bg-radial from-amber-500/5 via-transparent to-transparent z-10"
    >
      {/* Radar sweep background indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,92vw)] h-[min(520px,92vw)] rounded-full border border-orange-500/10 pointer-events-none">
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/35 bg-orange-500/10 text-orange-500 font-extrabold text-[11px] tracking-[2.5px] uppercase mb-8"
        >
          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
          防災演練系統 READY
        </motion.div>

        {/* Title */}
        <h1 className="font-ops text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-wider mb-6 flex flex-col gap-2">
          <span className="text-gray-100 flex items-center justify-center gap-3">
            <ShieldAlert className="w-10 h-10 md:w-16 md:h-16 text-orange-500 animate-[bounce_2s_infinite]" />
            災害應變
          </span>
          <span className="text-orange-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]">
            生存大挑戰
          </span>
          <span className="text-xs sm:text-sm md:text-base tracking-[0.4em] text-white/20 mt-2">
            SURVIVAL QUIZ PLATFORM
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base font-semibold leading-relaxed max-w-md mb-8">
          應對大自然危機，挑戰 4 種極端災害、20 道情境題目。
          <br />
          學習黃金防護觀念，與時間賽跑，成為真正的災害防護專家！
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10 max-w-sm">
          {chapters.map((ch) => (
            <span
              key={ch.id}
              className="px-4 py-1.5 rounded-lg text-sm font-extrabold border bg-gray-950/40 hover:scale-105 transition-transform"
              style={{ borderColor: ch.color, color: ch.color }}
            >
              {ch.emoji} {ch.titleZh}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            id="start-challenge-btn"
            onClick={onStartQuiz}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-extrabold text-lg text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_6px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_45px_rgba(249,115,22,0.6)] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            ⚡ 立即開始安全演練
          </button>

          {totalQuestions > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2 bg-gray-900/40 px-4 py-1.5 rounded-full border border-white/5">
              <Award className="w-4 h-4 text-orange-400" />
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
