/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { LogOut, ArrowRight, Flame } from "lucide-react";
import { Chapter } from "../types";

interface QuestionScreenProps {
  key?: string;
  chapter: Chapter;
  qIdx: number;
  streak: number;
  score: number;
  answered: boolean;
  selectedOption: number | null;
  onPickOption: (idx: number) => void;
  onNextQuestion: () => void;
  onExit: () => void;
}

export default function QuestionScreen({
  chapter,
  qIdx,
  streak,
  score,
  answered,
  selectedOption,
  onPickOption,
  onNextQuestion,
  onExit,
}: QuestionScreenProps) {
  const q = chapter.questions[qIdx];
  const total = chapter.questions.length;
  const progressPercent = Math.round((qIdx / total) * 100);

  // Calculate potential scores or streak bonuses
  const bonus = Math.min((streak - 1) * 5, 20);
  const earnedPoints = 10 + bonus;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-between min-h-screen sm:h-screen w-full max-w-2xl mx-auto px-4 py-3 relative z-10 overflow-y-auto"
    >
      {/* Top HUD Action Bar */}
      <div className="flex items-center gap-3 w-full mb-3 flex-shrink-0">
        {/* Chapter Icon and Tag Name */}
        <div
          className="px-3 py-1.5 rounded-xl text-xs font-extrabold border shrink-0 uppercase tracking-widest"
          style={{
            borderColor: chapter.color,
            color: chapter.color,
            backgroundColor: chapter.glow,
          }}
        >
          {chapter.emoji} {chapter.titleZh}
        </div>

        {/* Progress Bar Widget */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center text-[9px] font-black text-gray-400 tracking-wider mb-1 uppercase">
            <span>
              已完成 {qIdx} / {total} 題
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}88)`,
              }}
            />
          </div>
        </div>

        {/* Streak Flame Badge */}
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-2 py-1 font-bold text-xs text-yellow-400 shrink-0 animate-bounce"
          >
            <Flame className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>🔥 {streak} 連勝!</span>
          </motion.div>
        )}

        {/* Score Box */}
        <div className="bg-gray-900 border border-white/5 rounded-xl px-3 py-1 text-center min-w-[60px] shrink-0">
          <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest leading-none mb-0.5">
            SCORE
          </div>
          <div className="font-ops text-lg font-black text-yellow-400 leading-none">
            {score}
          </div>
        </div>
      </div>

      {/* Scenario Category Marker */}
      <div
        className="self-start px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border mb-2 shrink-0"
        style={{
          borderColor: `${chapter.color}44`,
          color: chapter.color,
          backgroundColor: chapter.glow,
        }}
      >
        📋 情境：{q.scenario}
      </div>

      {/* Primary Question Card */}
      <div className="w-full bg-gray-900/60 border border-white/5 rounded-xl p-4 sm:p-5 shrink-0 shadow-2xl backdrop-blur-md mb-2 flex-grow flex flex-col justify-center">
        {/* Question Counter Label */}
        <div className="font-ops text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
          Q{qIdx + 1} · {chapter.title} CHALLENGE
        </div>

        {/* Main Question Text */}
        <h3 className="text-base sm:text-lg font-semibold leading-normal text-gray-100 mb-3 font-sans">
          {q.q}
        </h3>

        {/* Answer Options Grid */}
        <div className="flex flex-col gap-2">
          {q.opts.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = q.ans === idx;

            // Compute styling states
            let optBorderClass = "border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10";
            let letterStyle = "bg-white/10 text-gray-400";
            let optClass = "hover:translate-x-1";

            if (answered) {
              optClass = "cursor-default";
              if (isCorrectAnswer) {
                // Correct answer glows green
                optBorderClass = "border-emerald-500 bg-emerald-500/10 text-emerald-100";
                letterStyle = "bg-emerald-500 text-black";
              } else if (isSelected) {
                // Selected option was not correct
                optBorderClass = "border-red-500 bg-red-500/10 text-red-100";
                letterStyle = "bg-red-500 text-white";
              } else {
                // Other options fade out
                optBorderClass = "border-white/5 bg-white/5 opacity-30";
                letterStyle = "bg-white/5 text-gray-600";
              }
            }

            return (
              <motion.button
                key={idx}
                disabled={answered}
                onClick={() => onPickOption(idx)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 sm:py-3 border rounded-xl text-left font-semibold text-sm transition-all duration-200 ${optBorderClass} ${optClass}`}
              >
                <div
                  className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center font-ops text-sm shrink-0 transition-colors ${letterStyle}`}
                >
                  {idx + 1}
                </div>
                <div className="text-xs sm:text-sm leading-snug text-current flex-1">
                  {option}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Correctness Feedback Card */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full rounded-xl p-3 sm:p-4 border-2 flex flex-col gap-2 shadow-xl shrink-0 ${
            selectedOption === q.ans
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-red-500/40 bg-red-500/5"
          }`}
        >
          {/* Header Verdict line */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{selectedOption === q.ans ? "✅" : "❌"}</span>
            <span
              className={`text-sm font-black ${
                selectedOption === q.ans ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {selectedOption === q.ans ? "答對了！防災觀念十分正確！" : "答錯了！正確防災方式記起來："}
            </span>

            <span
              className={`font-ops text-[11px] font-semibold ml-auto px-2 py-0.5 rounded ${
                selectedOption === q.ans ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800 text-gray-500"
              }`}
            >
              {selectedOption === q.ans ? `+${earnedPoints} FP` : "±0 PT"}
            </span>
          </div>

          {/* Slogan */}
          <span
            className={`font-ops text-xs font-bold tracking-wider py-1 px-3 rounded border w-fit font-mono ${
              selectedOption === q.ans
                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                : "border-orange-500/30 text-orange-400 bg-orange-500/10"
            }`}
          >
            【 {q.slogan} 】
          </span>

          {/* Detailed explanation */}
          <p className="text-gray-300 text-[11px] sm:text-xs font-medium leading-relaxed">
            {q.exp}
          </p>
        </motion.div>
      )}

      {/* Bottom control trigger buttons */}
      <div className="flex justify-between items-center gap-4 w-full mt-2.5 flex-shrink-0 pb-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-400 border border-white/5 hover:border-white/10 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          中斷關卡
        </button>

        {answered && (
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onNextQuestion}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all cursor-pointer border border-orange-400"
          >
            {qIdx + 1 >= total ? "前往關卡結算" : "下一題"}
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
