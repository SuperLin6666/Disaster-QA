/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { Chapter, Question } from "../types";

import eqCardUrl from "../assets/images/eq_ill_card_1779519005358.png";
import tyCardUrl from "../assets/images/ty_ill_card_1779519025600.png";
import fiCardUrl from "../assets/images/fi_ill_card_1779519043404.png";
import flCardUrl from "../assets/images/fl_ill_card_1779519063508.png";
import aidCardUrl from "../assets/images/aid_ill_card_1779520581198.png";
import radioCardUrl from "../assets/images/radio_ill_card_1779520600965.png";
import escapeCardUrl from "../assets/images/escape_ill_card_1779520620217.png";

const getQuestionImage = (chapterId: string, qIdx: number, qObj?: Question): string => {
  if (!qObj) {
    if (chapterId === "earthquake") {
      if (qIdx === 0 || qIdx === 1) return eqCardUrl;
      if (qIdx === 2 || qIdx === 3) return aidCardUrl;
      return radioCardUrl;
    }
    if (chapterId === "typhoon") {
      if (qIdx === 0) return tyCardUrl;
      if (qIdx === 1) return radioCardUrl;
      if (qIdx === 2) return flCardUrl;
      return aidCardUrl;
    }
    if (chapterId === "fire") {
      if (qIdx === 0) return escapeCardUrl;
      if (qIdx === 1) return fiCardUrl;
      if (qIdx === 2) return radioCardUrl;
      if (qIdx === 3) return aidCardUrl;
      if (qIdx === 4) return fiCardUrl;
      return aidCardUrl;
    }
    if (chapterId === "flood") {
      if (qIdx === 0 || qIdx === 1 || qIdx === 2) return flCardUrl;
      return aidCardUrl;
    }
    return eqCardUrl;
  }

  const text = (qObj.q + " " + qObj.scenario).toLowerCase();

  // 1. Fire-related
  if (text.includes("滅火") || text.includes("電線走火") || text.includes("119") || text.includes("報案") || text.includes("住警器") || text.includes("火災")) {
    if (text.includes("濃煙")) return escapeCardUrl;
    return fiCardUrl;
  }

  // 2. Escape, Evacuation
  if (text.includes("避難姿勢") || text.includes("低姿勢") || text.includes("逃生") || text.includes("撤離") || text.includes("離開室內")) {
    return escapeCardUrl;
  }

  // 3. Aid / Medical / Survival / CPR / Wound Care / Food Hygiene
  if (text.includes("避難包") || text.includes("急救") || text.includes("噎住") || text.includes("cpr") || text.includes("割傷") || text.includes("出血") || text.includes("燙傷") || text.includes("清洗消毒") || text.includes("飲水") || text.includes("食物")) {
    return aidCardUrl;
  }

  // 4. Radio / Communication
  if (text.includes("無線電") || text.includes("收音機") || text.includes("手電筒") || text.includes("通訊") || text.includes("1991") || text.includes("報平安")) {
    return radioCardUrl;
  }

  // 5. Flood / water wading / Landslides
  if (text.includes("淹水") || text.includes("土石") || text.includes("山鳴") || text.includes("水流") || text.includes("涉水") || text.includes("積水") || text.includes("排水")) {
    return flCardUrl;
  }

  // 6. Typhoon (weather, storm, winds, glass taping)
  if (text.includes("颱風") || text.includes("強風")) {
    return tyCardUrl;
  }

  // 7. Earthquake
  if (text.includes("地震") || text.includes("搖晃") || text.includes("震度") || text.includes("規模") || text.includes("家具")) {
    return eqCardUrl;
  }

  return eqCardUrl;
};

interface QuestionScreenProps {
  key?: string;
  chapter: Chapter;
  activeQuestions?: Question[];
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
  activeQuestions,
  qIdx,
  streak,
  score,
  answered,
  selectedOption,
  onPickOption,
  onNextQuestion,
  onExit,
}: QuestionScreenProps) {
  const questionsList = activeQuestions || chapter.questions;
  const q = questionsList[qIdx];
  const total = questionsList.length;
  const progressPercent = Math.round((qIdx / total) * 100);

  // Calculate potential scores or streak bonuses
  const bonus = Math.min((streak - 1) * 5, 20);
  const earnedPoints = 10 + bonus;

  const isUserCorrect = selectedOption === q.ans;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-6 md:py-10 z-10 overflow-y-auto">
      {/* Immersive Question layout container with max-w-4xl for maximum legibility */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl flex flex-col items-center justify-between flex-grow gap-6"
      >
        {/* Top HUD Action Bar / Larger Panel */}
        <div className="flex items-center justify-between gap-4 w-full bg-gray-900/40 border border-white/5 p-3 rounded-2xl backdrop-blur-md shrink-0">
          {/* Chapter Icon and Tag Name */}
          <div
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border shrink-0 uppercase tracking-widest flex items-center gap-2 select-none"
            style={{
              borderColor: chapter.color,
              color: chapter.color,
              backgroundColor: chapter.glow,
            }}
          >
            <span>{chapter.emoji}</span>
            <span>{chapter.titleZh} 關卡</span>
          </div>

          {/* Progress Bar Widget */}
          <div className="flex-1 min-w-0 max-w-md hidden sm:block">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 tracking-wider mb-1.5 uppercase">
              <span>
                進度：第 {qIdx + 1} 題 / 共 {total} 題
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}ee)`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Streak Flame Badge */}
            {streak >= 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/40 rounded-xl px-2.5 py-1.5 font-bold text-xs text-orange-400 shrink-0"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-[pulse_1.5s_infinite]" />
                <span>🔥 {streak} 連勝</span>
              </motion.div>
            )}

            {/* Score Box */}
            <div className="bg-gray-950 border border-white/10 rounded-xl px-4 py-1.5 text-center min-w-[70px] shadow-lg">
              <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider leading-none mb-1">
                SCORE
              </div>
              <div className="font-ops text-xl font-black text-yellow-400 leading-none">
                {score}
              </div>
            </div>
          </div>
        </div>

        {/* Small Progress bar for active Mobile users */}
        <div className="w-full sm:hidden shrink-0">
          <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 mb-1">
            <span>第 {qIdx + 1} / {total} 題</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: chapter.color,
              }}
            />
          </div>
        </div>

        {/* Primary Large Question Card with Beautiful Illustration Header */}
        <div className="w-full bg-gray-900/40 border border-white/5 rounded-2xl p-5 sm:p-8 shrink-0 shadow-2xl backdrop-blur-lg flex-grow flex flex-col justify-center relative overflow-hidden">
          
          {/* Question illustration situation context background decoration */}
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 w-full">
            
            {/* Large high-contrast Papercraft illustration representing situation scene directly */}
            <div className="w-full md:w-5/12 aspect-[16/11] sm:aspect-[16/10] md:aspect-square rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-[0_12px_35px_rgba(0,0,0,0.6)] bg-gray-950/80 relative group">
              <img
                src={getQuestionImage(chapter.id, qIdx, q)}
                alt={`${chapter.titleZh}情境`}
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${chapter.color}, transparent 80%)`
                }}
              />
              <div className="absolute left-3 bottom-3 bg-black/70 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-black flex items-center gap-1.5 backdrop-blur-md select-none">
                <BookOpen className="w-3.5 h-3.5" style={{ color: chapter.color }} />
                <span style={{ color: chapter.color }}>{chapter.emoji} 災害現場模擬</span>
              </div>
            </div>

            {/* Question Text block & Answers block */}
            <div className="flex-1 w-full flex flex-col justify-between min-h-full">
              <div className="mb-4">
                {/* Situation Label */}
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border mb-3 select-none"
                  style={{
                    borderColor: `${chapter.color}35`,
                    color: chapter.color,
                    backgroundColor: chapter.glow,
                  }}
                >
                  情境探討 ‧ {q.scenario}
                </span>

                {/* Highly Prominent, Extremely clear Question Text */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-wide text-gray-100 font-sans">
                  {q.q}
                </h2>
              </div>

              {/* Answer Options Grid - Spacious & highly touch target compliant */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                {q.opts.map((option, idx) => {
                  return (
                    <motion.button
                      key={idx}
                      disabled={answered}
                      onClick={() => onPickOption(idx)}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center gap-4 px-4 py-3.5 sm:py-4.5 border rounded-xl text-left font-bold text-sm sm:text-base transition-all duration-200 border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer text-gray-200"
                    >
                      {/* Stylized Option Identifier box */}
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-ops text-sm sm:text-base font-black shrink-0 transition-colors bg-white/10 text-gray-300"
                      >
                        {idx + 1}
                      </div>
                      <div className="leading-snug flex-1 pr-2 font-medium">
                        {option}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom controls panel */}
        <div className="flex justify-between items-center gap-4 w-full shrink-0">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 border border-white/5 hover:border-white/12 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            中斷，回關卡列表
          </button>
          
          <div className="text-[10px] font-bold text-gray-500 tracking-wider">
            🚨 仔細思考，選出唯一的正確活命決策
          </div>
        </div>
      </motion.div>

      {/* 
        "答案和解釋請以新的一頁跳出顯示，並有插圖。增加趣味性"
        Immersive, Full-Screen Animated Sliding Study Popup Overlay 
      */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed inset-0 w-full h-full z-50 flex items-center justify-center px-4 py-4 md:py-6 overflow-y-auto backdrop-blur-2xl bg-slate-950/98"
          >
            {/* Soft background glow based on correctness */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: isUserCorrect
                  ? "radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)"
                  : "radial-gradient(circle at 50% 50%, #ef4444 0%, transparent 70%)"
              }}
            />

            {/* Compact content container */}
            <div className="relative w-full max-w-xl bg-gray-900/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center flex flex-col gap-4 my-auto select-none">
              
              {/* Confetti details */}
              <div className="absolute top-3 left-4 text-gray-700 animate-spin whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ⚙️ 🌀 ⚡
              </div>
              <div className="absolute top-3 right-4 text-gray-700 animate-bounce whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ✨ ☄️ 🌟
              </div>

              {/* High fidelity inline status & score banner with situational image stamp */}
              <div className="flex flex-row items-center justify-between gap-4 w-full bg-gray-950/40 border border-white/5 p-3 rounded-xl text-left">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {isUserCorrect ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="font-ops text-sm font-black leading-none tracking-wide">防護判斷正確！ 🌟</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span className="font-ops text-sm font-black leading-none tracking-wide">觀念需要修正！</span>
                    </div>
                  )}

                  {/* Score badge details inside */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span>本題得分：</span>
                    <span className={`font-black ${isUserCorrect ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {isUserCorrect ? `+${earnedPoints} FP` : "±0 PT"}
                    </span>
                    {streak >= 2 && isUserCorrect && (
                      <span className="text-orange-400 font-extrabold text-[10px]">
                        （🔥 {streak}連勝加成）
                      </span>
                    )}
                  </div>
                </div>

                {/* Question-aligned illustration thumbnail stamp */}
                <div 
                  className="w-12 h-12 rounded-xl overflow-hidden border shadow-md bg-gray-950 flex-shrink-0 relative group animate-pulse"
                  style={{ borderColor: chapter.color }}
                >
                  <img
                    src={getQuestionImage(chapter.id, qIdx, q)}
                    alt={chapter.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-1 bottom-1 bg-black/60 rounded px-1 py-[0.5px] text-[8px] text-white leading-none">
                    {chapter.emoji}
                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div 
                className="font-ops text-xs sm:text-sm font-black tracking-widest py-1 px-4 rounded-lg border w-fit mx-auto"
                style={{
                  borderColor: `${chapter.color}40`,
                  color: chapter.color,
                  backgroundColor: chapter.glow,
                }}
              >
                【 {q.slogan} 】
              </div>

              {/* High-visibility QA recap details */}
              <div className="text-left w-full bg-gray-950/60 border border-white/5 rounded-xl p-3 text-xs sm:text-sm">
                <div className="text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="line-clamp-1">問題：{q.q}</span>
                </div>
                <div className="text-emerald-300 font-extrabold flex items-center gap-1.5 mt-1 border-t border-white/5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">正解：{q.opts[q.ans]}</span>
                </div>
                {!isUserCorrect && (
                  <div className="text-red-300 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-4 text-center text-xs shrink-0">❌</span>
                    <span className="line-clamp-1">您選：{q.opts[selectedOption ?? 0]}</span>
                  </div>
                )}
              </div>

              {/* Explanatory description */}
              <p className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed max-w-lg mx-auto pl-1">
                💡 {q.exp}
              </p>

              {/* Bottom Next Question CTA triggers */}
              <div className="w-full pt-1">
                <button
                  onClick={onNextQuestion}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-orange-400"
                >
                  <span>{qIdx + 1 >= total ? "進入關卡成果結算" : "理解了，下一題"}</span>
                  <ArrowRight className="w-4 h-4 animate-bounce" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

