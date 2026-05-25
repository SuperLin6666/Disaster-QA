/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Play, ShieldAlert, Award, Maximize2, Minimize2 } from "lucide-react";
import { Chapter } from "../types";
import { useState, useEffect } from "react";
import heroBannerUrl from "../assets/images/survival_hero_banner_1779518986066.png";

interface HomeScreenProps {
  key?: string;
  chapters: Chapter[];
  onStartQuiz: () => void;
  onSelectChapter: (idx: number) => void;
  onStartMixedChallenge: () => void;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
}

export default function HomeScreen({
  chapters,
  onStartQuiz,
  onSelectChapter,
  onStartMixedChallenge,
  totalScore,
  totalCorrect,
  totalQuestions,
}: HomeScreenProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", checkFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
    };
  }, []);

  const requestFullscreenSafe = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen permission denied:", err);
      });
    }
  };

  const handleStartActiveQuiz = () => {
    requestFullscreenSafe();
    onStartQuiz();
  };

  const handleStartMixedChallenge = () => {
    requestFullscreenSafe();
    onStartMixedChallenge();
  };

  const handleSelectActiveChapter = (idx: number) => {
    requestFullscreenSafe();
    onSelectChapter(idx);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen permission denied:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  };

  return (
    <motion.div
      id="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, exit: -15 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 sm:py-12 text-center bg-radial from-amber-500/5 via-transparent to-transparent z-10 overflow-y-auto"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/35 bg-orange-500/10 text-orange-500 font-extrabold text-xs sm:text-sm tracking-[2.5px] uppercase mb-4 sm:mb-5"
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
          防災演練系統 READY
        </motion.div>

        {/* Title */}
        <h1 className="font-ops text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black leading-none tracking-wider mb-4 flex flex-col gap-1">
          <span className="text-gray-100 flex items-center justify-center gap-2">
            <ShieldAlert className="w-8 h-8 md:w-11 md:h-11 text-orange-500 animate-[bounce_2s_infinite]" />
            防災知識
          </span>
          <span className="text-orange-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]">
            PK賽
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.4em] text-white/20 mt-1">
            DISASTER SURVIVAL PK CHALLENGE
          </span>
        </h1>

        {/* 3D Papercraft-style Hero Banner Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[280px] sm:max-w-[340px] aspect-[16/9] rounded-2xl overflow-hidden border border-orange-500/20 shadow-[0_10px_30px_rgba(249,115,22,0.15)] mb-4 shrink-0 bg-gray-950"
        >
          <img
            src={heroBannerUrl}
            alt="Safety Hero Banner Illustration"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Description */}
        <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-relaxed max-w-xl mb-5 font-sans">
          應對大自然危機，挑戰 4 種極端災害、10 道情境題目。
          <br />
          學習黃金防護觀念，與時間賽跑，成為真正的災害防護專家！
        </p>

        {/* Category Pills */}
        <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
          <span className="text-xs sm:text-sm text-gray-400 font-extrabold uppercase tracking-wider">
            👉 點擊按鈕，直接開始指定主題關卡：
          </span>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-lg">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => handleSelectActiveChapter(idx)}
                className="px-4.5 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-black border-2 bg-gray-950/65 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-md"
                style={{ borderColor: ch.color, color: ch.color }}
              >
                {ch.emoji} {ch.titleZh}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Fullscreen Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center max-w-lg">
          <button
            id="start-challenge-btn"
            onClick={handleStartMixedChallenge}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-base text-white bg-gradient-to-r from-orange-500 to-red-650 shadow-[0_6px_25px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-95 transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            ⚡ 立即開始安全演練 (隨機綜合)
          </button>

          <button
            onClick={handleStartActiveQuiz}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-gray-200 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
          >
            📂 選擇主題關卡
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-gray-400 border border-white/5 hover:border-white/10 hover:text-white hover:bg-white/5 transition-all cursor-pointer bg-gray-900/40 w-full sm:w-auto justify-center"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-orange-400" />
                <span>退出全螢幕</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-orange-400" />
                <span>🖥️ 全螢幕</span>
              </>
            )}
          </button>
        </div>

        {totalQuestions > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mt-4 bg-gray-900/40 px-3 py-1 rounded-full border border-white/5">
            <Award className="w-3.5 h-3.5 text-orange-400" />
            <span>
              歷史紀錄：{totalCorrect} / {totalQuestions} 答對・累計 {totalScore} 分
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
