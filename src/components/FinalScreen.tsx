/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { RotateCcw, LayoutGrid } from "lucide-react";
import { Chapter, ChapterResult } from "../types";

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
      className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto px-4 py-8 relative z-10 text-center bg-radial from-yellow-400/5 via-transparent to-transparent"
    >
      {/* Medal icon */}
      <div className="text-6xl mb-3 drop-shadow-[0_8px_16px_rgba(255,215,64,0.3)] animate-bounce">
        🎖️
      </div>

      <h2 className="font-ops text-4xl sm:text-5xl font-black text-yellow-400 tracking-wider mb-8 drop-shadow-md">
        應變演練‧成功完成！
      </h2>

      {/* Radial score ring display */}
      <div className="relative w-40 h-40 rounded-full border-4 border-yellow-400 flex flex-col items-center justify-center bg-gray-950/80 shadow-[0_0_50px_rgba(250,204,21,0.25)] mb-6 transition-all duration-300 hover:scale-105">
        <div className="font-ops text-5xl font-black text-yellow-400 leading-none">
          {score}
        </div>
        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1.5 label-total">
          災害綜合防護分
        </div>
      </div>

      {/* Expert Rating Summary */}
      <div className="bg-gray-900/60 border border-white/5 rounded-2xl py-4.5 px-6 max-w-md mb-8 shadow-md">
        <p className="text-gray-100 text-sm sm:text-base font-semibold leading-relaxed">
          {rating}
        </p>
      </div>

      {/* Chapters Detailed Breakdown Bento Grid */}
      <div className="flex flex-col gap-3.5 w-full max-w-md mb-10 text-left">
        <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-2 mb-1 pl-1">
          關卡答對率與星級徽章
        </h4>

        {chapters.map((ch) => {
          const r = results[ch.id];
          if (!r) {
            return (
              <div
                key={ch.id}
                className="flex items-center gap-3 bg-gray-900/40 border border-white/5 rounded-xl px-4 py-3 opacity-50"
              >
                <div className="text-xl shrink-0">{ch.emoji}</div>
                <div className="text-sm font-bold text-gray-400 flex-1">{ch.titleZh}</div>
                <div className="text-xs font-semibold text-gray-500">未嘗試</div>
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
              className="flex items-center gap-4 bg-gray-900/60 border border-white/5 rounded-xl px-4 py-3.5 shadow-sm"
            >
              <div className="text-2xl shrink-0">{ch.emoji}</div>
              <div
                className="text-sm sm:text-base font-black shrink-0 min-w-[42px]"
                style={{ color: ch.color }}
              >
                {ch.titleZh}
              </div>

              {/* Progress bar representing ratio */}
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${progressColor}`}
                  style={{ width: `${frac * 100}%` }}
                />
              </div>

              {/* Fractional text correct answers */}
              <div className="text-xs font-bold text-gray-400 min-w-[34px] text-right">
                {r.correct}/{r.total}
              </div>

              {/* Stars badge reward */}
              <div className="text-xs sm:text-sm tracking-wider font-semibold">
                {getStars(r.correct, r.total)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w-sm">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-black text-gray-400 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          重新挑戰
        </button>

        <button
          onClick={onGoToChapters}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_25px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
        >
          <LayoutGrid className="w-4.5 h-4.5" />
          回關卡列表
        </button>
      </div>
    </motion.div>
  );
}
