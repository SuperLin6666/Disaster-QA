/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Award, Flame, CheckCircle, Trophy, Trash2 } from "lucide-react";
import { Chapter, ChapterResult } from "../types";
import FullscreenButton from "./FullscreenButton";

import eqCardUrl from "../assets/images/eq_ill_card_1779519005358.png";
import tyCardUrl from "../assets/images/ty_ill_card_1779519025600.png";
import fiCardUrl from "../assets/images/fi_ill_card_1779519043404.png";
import flCardUrl from "../assets/images/fl_ill_card_1779519063508.png";

const CHAPTER_IMAGES: Record<string, string> = {
  earthquake: eqCardUrl,
  typhoon: tyCardUrl,
  fire: fiCardUrl,
  flood: flCardUrl,
};

interface ChapterSelectScreenProps {
  key?: string;
  chapters: Chapter[];
  onSelectChapter: (idx: number) => void;
  onGoBack: () => void;
  onShowFinalResults: () => void;
  onReset: () => void;
  doneChapters: string[];
  results: Record<string, ChapterResult>;
  totalScore: number;
  totalCorrect: number;
  streak: number;
}

export default function ChapterSelectScreen({
  chapters,
  onSelectChapter,
  onGoBack,
  onShowFinalResults,
  onReset,
  doneChapters,
  results,
  totalScore,
  totalCorrect,
  streak,
}: ChapterSelectScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const getStars = (correct: number, total: number) => {
    const ratio = correct / total;
    if (ratio === 1) return "⭐⭐⭐";
    if (ratio >= 0.6) return "⭐⭐☆";
    return "⭐☆☆";
  };

  const allCompleted = doneChapters.length === chapters.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-start min-h-screen w-full max-w-2xl mx-auto px-4 py-4 relative z-10 overflow-y-auto"
    >
      <header className="text-center mb-6 shrink-0">
        <h2 className="font-ops text-4xl sm:text-5xl font-black tracking-wider text-white mb-2">
          選擇挑戰關卡
        </h2>
        <p className="text-gray-300 text-sm sm:text-lg font-bold max-w-lg mx-auto leading-relaxed">
          共有 4 大災害情境，完成全部關卡可解鎖災害防禦大師成就！
        </p>
      </header>

      {/* Scoreboard Metrics */}
      <div className="flex items-center w-full max-w-xl bg-gray-900/60 border border-white/5 rounded-xl overflow-hidden mb-6 shadow-xl backdrop-blur-md shrink-0">
        <div className="flex-1 px-4 py-3 text-center border-r border-white/5">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-gray-400 mb-0.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            總得分
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-orange-400">
            {totalScore}
          </div>
        </div>
        <div className="flex-1 px-4 py-3 text-center border-r border-white/5">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-gray-400 mb-0.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            累計答對
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-green-400">
            {totalCorrect}
          </div>
        </div>
        <div className="flex-1 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-gray-400 mb-0.5">
            <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            當前連勝
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-cyan-400">
            {streak}
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xl mb-4 flex-grow content-center">
        {chapters.map((ch, i) => {
          const r = results[ch.id];
          const isDone = doneChapters.includes(ch.id);
          const stars = isDone ? getStars(r.correct, r.total) : "☆☆☆";

          return (
            <motion.div
              type="button"
              key={ch.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChapter(i)}
              className={`relative bg-gray-900/60 border-2 rounded-xl p-4 sm:p-5 flex flex-col items-center text-center justify-between cursor-pointer overflow-hidden transition-all duration-300 backdrop-blur-md ${
                isDone ? "border-solid shadow-lg" : "border-white/5 hover:border-white/20"
              }`}
              style={{
                borderColor: isDone ? ch.color : undefined,
                boxShadow: isDone ? `0 6px 15px -3px ${ch.color}20` : undefined,
              }}
            >
              {/* Radial background ambient gradient */}
              <div
                className="absolute -inset-10 bg-radial from-transparent via-transparent pointer-events-none transition-opacity duration-300 opacity-20 hover:opacity-100"
                style={{
                  backgroundImage: `radial-gradient(circle, ${ch.color}15 0%, transparent 70%)`,
                }}
              />

              {/* Checked Badge */}
              {isDone && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md z-10"
                  style={{
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  ✓
                </div>
              )}

              {/* Card Contents */}
              <div className="flex flex-col items-center relative z-10 w-full">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2.5 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-gray-950/80 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={CHAPTER_IMAGES[ch.id] || ""}
                    alt={ch.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-1 bottom-1 bg-black/60 rounded-md px-1 py-0.5 text-xs font-bold leading-none select-none">
                    {ch.emoji}
                  </div>
                </div>
                <h3
                  className="font-ops text-lg sm:text-2xl font-black tracking-wider mb-1"
                  style={{ color: ch.color }}
                >
                  {ch.title}
                </h3>
                <p className="text-gray-200 text-sm sm:text-lg font-black tracking-wider uppercase mb-1.5 sm:mb-2 bg-white/5 px-2 py-0.5 rounded">
                  {ch.titleZh}
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-400">
                  {ch.questions.length} 道實戰情境題
                </p>
              </div>

              {/* Status / Achievements inside Card */}
              <div className="relative z-10 w-full mt-3 pt-2.5 border-t border-white/10 flex flex-col items-center">
                <div className="text-sm sm:text-base tracking-[0.15em] mb-1.5">{stars}</div>
                {isDone && (
                  <p
                    className="text-xs sm:text-sm md:text-base font-black tracking-wide"
                    style={{ color: ch.color }}
                  >
                    成績：{r.correct} / {r.total} 答對
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation and Completion triggers */}
      <div className="flex flex-wrap gap-3 justify-center items-center w-full max-w-xl shrink-0 pb-3">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          回首頁
        </button>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold text-red-400/80 border border-red-500/20 hover:border-red-500/45 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清除當前紀錄
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-1.5 px-3 text-xs">
            <span className="font-bold text-red-300">確定要重置？</span>
            <button
              onClick={() => {
                onReset();
                setShowConfirm(false);
              }}
              className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-black cursor-pointer transition-colors"
            >
              確定
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] font-bold cursor-pointer transition-colors"
            >
              取消
            </button>
          </div>
        )}

        {allCompleted ? (
          <button
            id="view-results-btn"
            onClick={onShowFinalResults}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            顯示最終成效報告
          </button>
        ) : (
          <div className="text-[10px] text-gray-500 font-semibold px-3 py-2 bg-gray-950/40 border border-white/5 rounded-lg">
            🔒 回答完其餘關卡解鎖最終成果
          </div>
        )}
      </div>

      <div className="mt-4 pb-4 shrink-0">
        <FullscreenButton />
      </div>
    </motion.div>
  );
}
