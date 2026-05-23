/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { RotateCcw, LayoutGrid } from "lucide-react";
import { Chapter, ChapterResult } from "../types";
import FullscreenButton from "./FullscreenButton";

interface FinalScreenProps {
  key?: string;
  chapters: Chapter[];
  score: number;
  results: Record<string, ChapterResult>;
  onReset: () => void;
  onGoToChapters: () => void;
}

export default function FinalScreen({
  chapters,
  score,
  results,
  onReset,
  onGoToChapters,
}: FinalScreenProps) {
  // Compute overall statistics
  const totalCorrect = (Object.values(results) as ChapterResult[]).reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = chapters.reduce((sum, ch) => sum + ch.questions.length, 0);
  const ratio = totalCorrect / totalQuestions;

  // Rating and motivation statements
  let rating = "";
  if (ratio === 1) {
    rating = "🏆 完美無瑕！你已掌握極致的災害應變生存技能，當之無愧的防災大師！";
  } else if (ratio >= 0.8) {
    rating = "🌟 卓越超群！你的防災心態與預備觀念非常紮實，能在緊急中穩住腳步！";
  } else if (ratio >= 0.6) {
    rating = "👍 蓄勢待發！防災知能非常良好！若能多加複習，防護成效會更加完美！";
  } else {
    rating = "📚 仍需努力！多加學習正確防災應變方式，危機發生時才能在第一時間保護家人！";
  }

  // Generate star strings
  const getStars = (correct: number, total: number) => {
    const ratio = correct / total;
    if (ratio === 1) return "⭐⭐⭐";
    if (ratio >= 0.6) return "⭐⭐☆";
    return "⭐☆☆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 relative z-10 text-center bg-radial from-yellow-400/5 via-transparent to-transparent overflow-y-auto"
    >
      {/* Medal icon */}
      <div className="text-4xl mb-1 drop-shadow-[0_8px_16px_rgba(255,215,64,0.3)] animate-bounce">
        🎖️
      </div>

      <h2 className="font-ops text-2xl sm:text-3xl font-black text-yellow-400 tracking-wider mb-4 drop-shadow-md">
        應變演練‧成功完成！
      </h2>

      {/* Radial score ring display */}
      <div className="relative w-28 h-28 rounded-full border-4 border-yellow-400 flex flex-col items-center justify-center bg-gray-950/80 shadow-[0_0_35px_rgba(250,204,21,0.25)] mb-4 transition-all duration-300 hover:scale-105">
        <div className="font-ops text-3xl font-black text-yellow-400 leading-none">
          {score}
        </div>
        <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest mt-1 label-total">
          災害綜合防護分
        </div>
      </div>

      {/* Expert Rating Summary */}
      <div className="bg-gray-900/60 border border-white/5 rounded-xl py-2 px-4 max-w-md mb-4 shadow-md">
        <p className="text-gray-100 text-xs sm:text-sm font-semibold leading-relaxed">
          {rating}
        </p>
      </div>

      {/* Chapters Detailed Breakdown Bento Grid */}
      <div className="flex flex-col gap-2 w-full max-w-md mb-5 text-left">
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-1 mb-0.5 pl-1">
          關卡答對率與星級徽章
        </h4>

        {chapters.map((ch) => {
          const r = results[ch.id];
          if (!r) {
            return (
              <div
                key={ch.id}
                className="flex items-center gap-2 bg-gray-900/40 border border-white/5 rounded-xl px-3 py-2 opacity-50"
              >
                <div className="text-lg shrink-0">{ch.emoji}</div>
                <div className="text-xs font-bold text-gray-400 flex-1">{ch.titleZh}</div>
                <div className="text-[10px] font-semibold text-gray-500">未嘗試</div>
              </div>
            );
          }

          const frac = r.correct / r.total;
          let progressColor = "bg-red-500";
          if (frac === 1) {
            progressColor = "bg-emerald-400";
          } else if (frac >= 0.6) {
            progressColor = "bg-yellow-400";
          }

          return (
            <div
              key={ch.id}
              className="flex items-center gap-3 bg-gray-900/60 border border-white/5 rounded-xl px-3 py-2.5 shadow-sm"
            >
              <div className="text-xl shrink-0">{ch.emoji}</div>
              <div
                className="text-xs sm:text-sm font-black shrink-0 min-w-[36px]"
                style={{ color: ch.color }}
              >
                {ch.titleZh}
              </div>

              {/* Progress bar representing ratio */}
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${progressColor}`}
                  style={{ width: `${frac * 100}%` }}
                />
              </div>

              {/* Fractional text correct answers */}
              <div className="text-[11px] font-bold text-gray-400 min-w-[30px] text-right">
                {r.correct}/{r.total}
              </div>

              {/* Stars badge reward */}
              <div className="text-xs tracking-wider font-semibold">
                {getStars(r.correct, r.total)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Controls */}
      <div className="flex flex-wrap gap-2.5 justify-center items-center w-full max-w-sm">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-xs font-black text-gray-400 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新挑戰
        </button>

        <button
          onClick={onGoToChapters}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_15px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
        >
          <LayoutGrid className="w-4 h-4" />
          回關卡列表
        </button>
      </div>

      <div className="mt-5 pb-2 shrink-0">
        <FullscreenButton />
      </div>
    </motion.div>
  );
}
