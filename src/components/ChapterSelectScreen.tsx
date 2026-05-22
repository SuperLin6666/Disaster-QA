/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowLeft, Award, Flame, CheckCircle, Trophy } from "lucide-react";
import { Chapter, ChapterResult } from "../types";

interface ChapterSelectScreenProps {
  key?: string;
  chapters: Chapter[];
  onSelectChapter: (idx: number) => void;
  onGoBack: () => void;
  onShowFinalResults: () => void;
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
  doneChapters,
  results,
  totalScore,
  totalCorrect,
  streak,
}: ChapterSelectScreenProps) {
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
      className="flex flex-col items-center justify-start min-h-screen w-full max-w-4xl mx-auto px-4 py-8 relative z-10"
    >
      <header className="text-center mb-8">
        <h2 className="font-ops text-4xl sm:text-5xl font-black tracking-wider text-white mb-2">
          選擇挑戰關卡
        </h2>
        <p className="text-gray-400 text-sm font-semibold max-w-md mx-auto">
          共有 4 大災害情境，完成全部關卡可解鎖災害防禦大師成就！
        </p>
      </header>

      {/* Scoreboard Metrics */}
      <div className="flex items-center w-full max-w-2xl bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden mb-8 shadow-2xl backdrop-blur-md">
        <div className="flex-1 px-5 py-4 text-center border-r border-white/5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            總得分
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-orange-400">
            {totalScore}
          </div>
        </div>
        <div className="flex-1 px-5 py-4 text-center border-r border-white/5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            累計答對
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-green-400">
            {totalCorrect}
          </div>
        </div>
        <div className="flex-1 px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
            <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            當前連勝
          </div>
          <div className="font-ops text-2xl sm:text-3xl font-black text-cyan-400">
            {streak}
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {chapters.map((ch, i) => {
          const r = results[ch.id];
          const isDone = doneChapters.includes(ch.id);
          const stars = isDone ? getStars(r.correct, r.total) : "☆☆☆";

          return (
            <motion.div
              type="button"
              key={ch.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChapter(i)}
              className={`relative bg-gray-900/60 border-2 rounded-2xl p-6 flex flex-col items-center text-center justify-between cursor-pointer overflow-hidden transition-all duration-300 backdrop-blur-md ${
                isDone ? "border-solid shadow-lg" : "border-white/5 hover:border-white/20"
              }`}
              style={{
                borderColor: isDone ? ch.color : undefined,
                boxShadow: isDone ? `0 10px 25px -5px ${ch.color}25` : undefined,
              }}
            >
              {/* Radial background ambient gradient */}
              <div
                className="absolute -inset-10 bg-radial from-transparent via-transparent pointer-events-none transition-opacity duration-300 opacity-30 hover:opacity-100"
                style={{
                  backgroundImage: `radial-gradient(circle, ${ch.color}15 0%, transparent 70%)`,
                }}
              />

              {/* Checked Badge */}
              {isDone && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md z-10"
                  style={{
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  ✓
                </div>
              )}

              {/* Card Contents */}
              <div className="flex flex-col items-center relative z-10 w-full">
                <span className="text-5xl mb-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform">
                  {ch.emoji}
                </span>
                <h3
                  className="font-ops text-xl sm:text-2xl font-bold tracking-wider mb-0.5"
                  style={{ color: ch.color }}
                >
                  {ch.title}
                </h3>
                <p className="text-gray-400 text-xs font-black tracking-wider uppercase mb-3">
                  {ch.titleZh}
                </p>
                <p className="text-xs font-bold text-gray-500 mb-2">
                  {ch.questions.length} 道實戰情境題
                </p>
              </div>

              {/* Status / Achievements inside Card */}
              <div className="relative z-10 w-full mt-2 pt-2 border-t border-white/5 flex flex-col items-center">
                <div className="text-base tracking-[0.2em] mb-1.5">{stars}</div>
                {isDone && (
                  <p
                    className="text-xs font-black tracking-wide"
                    style={{ color: ch.color }}
                  >
                    分數：{r.correct} / {r.total} 答對
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation and Completion triggers */}
      <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w-2xl">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-extrabold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          回首頁
        </button>

        {allCompleted ? (
          <button
            id="view-results-btn"
            onClick={onShowFinalResults}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_4px_25px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-orange-400"
          >
            <Award className="w-4.5 h-4.5 text-yellow-300" />
            顯示最終成效報告
          </button>
        ) : (
          <div className="text-xs text-gray-500 font-semibold px-4 py-3 bg-gray-950/40 border border-white/5 rounded-xl">
            🔒 回答完其餘關卡解鎖最終成果
          </div>
        )}
      </div>
    </motion.div>
  );
}
