/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, X, ShieldAlert, Grid, ArrowRight } from "lucide-react";
import { Chapter } from "../types";

import eqCardUrl from "../assets/images/eq_ill_card_1779519005358.png";
import tyCardUrl from "../assets/images/ty_ill_card_1779519025600.png";
import fiCardUrl from "../assets/images/fi_ill_card_1779519043404.png";
import flCardUrl from "../assets/images/fl_ill_card_1779519063508.png";

const CHAPTER_IMAGES: Record<string, string> = {
  earthquake: eqCardUrl,
  typhoon: tyCardUrl,
  fire: fiCardUrl,
  flood: flCardUrl,
  mixed_pk: flCardUrl,
};

interface LevelCompleteScreenProps {
  key?: string;
  chapter: Chapter;
  correctCount: number;
  wrongCount: number;
  currentScore: number;
  nextChapter: Chapter | null;
  onGoToChapters: () => void;
  onStartNextChapter: () => void;
  onShowFinalResults: () => void;
}

export default function LevelCompleteScreen({
  chapter,
  correctCount,
  wrongCount,
  currentScore,
  nextChapter,
  onGoToChapters,
  onStartNextChapter,
  onShowFinalResults,
}: LevelCompleteScreenProps) {
  const total = chapter.questions.length || (correctCount + wrongCount) || 4;
  const ratio = correctCount / total;

  // Decide Medal and Status Title
  let glyph = "🥉";
  let verdictText = "KEEP GOING!";
  let verdictColor = "text-orange-500";

  if (ratio === 1) {
    glyph = "🏆";
    verdictText = "PERFECT CLEAR!";
    verdictColor = "text-emerald-400";
  } else if (ratio >= 0.6) {
    glyph = "🥈";
    verdictText = "WELL DONE!";
    verdictColor = "text-yellow-400";
  }

  // Generate star string
  const renderStars = () => {
    if (ratio === 1) return "⭐⭐⭐";
    if (ratio >= 0.6) return "⭐⭐☆";
    return "⭐☆☆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 relative z-10 text-center overflow-y-auto"
      style={{
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 30%, ${chapter.color}15 0%, transparent 70%)`,
      }}
    >
      {/* Integrated high-fidelity 3D illustrated card badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
        className="relative mb-3 flex items-center justify-center shrink-0 select-none pb-2"
      >
        <div 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shadow-[0_8px_25px_rgba(0,0,0,0.55)] bg-gray-950 flex-shrink-0"
          style={{ borderColor: chapter.color }}
        >
          <img
            src={CHAPTER_IMAGES[chapter.id] || ""}
            alt={chapter.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-1 -right-2 text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          {glyph}
        </div>
      </motion.div>

      {/* Completion verdict */}
      <h2 className={`font-ops text-3xl sm:text-4xl font-black tracking-wider leading-none mb-1.5 ${verdictColor}`}>
        {verdictText}
      </h2>

      {/* Chapter metadata title */}
      <p className="text-gray-400 text-xs sm:text-sm font-black tracking-wider uppercase mb-3 flex items-center gap-2 justify-center">
        {chapter.emoji} {chapter.titleZh} 關卡演練結算
      </p>

      {/* Star indicator block */}
      <div className="text-2xl tracking-[0.2em] mb-4 transform hover:scale-110 transition-transform duration-300">
        {renderStars()}
      </div>

      {/* Numerical Stats block */}
      <div className="flex gap-3 mb-6 w-full max-w-md justify-center flex-wrap">
        {/* Correct metrics block */}
        <div className="flex-1 min-w-[90px] bg-gray-900 border border-white/5 rounded-xl p-3 flex flex-col items-center shadow-lg">
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
            <Check className="w-4 h-4" />
          </div>
          <div className="font-ops text-2xl font-black text-emerald-400">
            {correctCount}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
            答對
          </div>
        </div>

        {/* Incorrect metrics block */}
        <div className="flex-1 min-w-[90px] bg-gray-900 border border-white/5 rounded-xl p-3 flex flex-col items-center shadow-lg">
          <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-1">
            <X className="w-3.5 h-3.5" />
          </div>
          <div className="font-ops text-2xl font-black text-red-400">
            {wrongCount}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
            答錯
          </div>
        </div>

        {/* Acquired cumulative score block */}
        <div className="flex-1 min-w-[90px] bg-gray-900 border border-white/5 rounded-xl p-3 flex flex-col items-center shadow-lg">
          <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mb-1">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="font-ops text-2xl font-black text-yellow-400">
            {currentScore}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
            累計分值
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex flex-wrap gap-2.5 justify-center items-center w-full max-w-sm">
        <button
          onClick={onGoToChapters}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-xs font-extrabold text-gray-400 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5" />
          回選關卡卡牌
        </button>

        {nextChapter ? (
          <button
            onClick={onStartNextChapter}
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
          >
            <span>{nextChapter.emoji} 前往 {nextChapter.titleZh}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onShowFinalResults}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_4px_25px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
          >
            <span>🎖️ 完成 ‧ 結算總成績</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
