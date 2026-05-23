/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
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
import FullscreenButton from "./FullscreenButton";

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
  const activeCh = q?.chapter || chapter;
  const total = questionsList.length;
  const progressPercent = Math.round((qIdx / total) * 100);

  const [prevView, setPrevView] = useState({ qIdx, answered });
  const [timeLeft, setTimeLeft] = useState(answered ? 10 : 20);

  if (prevView.qIdx !== qIdx || prevView.answered !== answered) {
    setPrevView({ qIdx, answered });
    setTimeLeft(answered ? 10 : 20);
  }

  // Handle ticking countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qIdx, answered]);

  // Handle auto transitions when countdown reaches 0 safely within useEffect
  useEffect(() => {
    if (timeLeft === 0) {
      if (!answered) {
        onPickOption(-1);
      } else {
        onNextQuestion();
      }
    }
  }, [timeLeft, answered, onPickOption, onNextQuestion]);

  // Calculate potential scores or streak bonuses
  const bonus = Math.min((streak - 1) * 5, 20);
  const earnedPoints = 10 + bonus;

  const isUserCorrect = selectedOption === q.ans;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-3 sm:py-5 z-10 overflow-y-auto">
      {/* Immersive Question layout container with max-w-4xl for maximum legibility */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl flex flex-col items-center justify-between flex-grow gap-4 sm:gap-5"
      >
        {/* Top HUD Action Bar / Larger Panel */}
        <div className="flex items-center justify-between gap-4 w-full bg-gray-900/40 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md shrink-0">
          {/* Chapter Icon and Tag Name */}
          <div
            className="px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base font-black border shrink-0 uppercase tracking-widest flex items-center gap-2 select-none"
            style={{
              borderColor: activeCh.color,
              color: activeCh.color,
              backgroundColor: activeCh.glow,
            }}
          >
            <span>{activeCh.emoji}</span>
            <span>{activeCh.titleZh} 關卡</span>
          </div>

          {/* Progress Bar Widget */}
          <div className="flex-1 min-w-0 max-w-md hidden sm:block">
            <div className="flex justify-between items-center text-xs sm:text-sm font-black text-gray-200 tracking-wider mb-2 uppercase">
              <span>
                進度：第 {qIdx + 1} 題 / 共 {total} 題
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${activeCh.color}, ${activeCh.color}ee)`,
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
                className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/45 rounded-xl px-3.5 py-2 font-black text-sm text-orange-400 shrink-0"
              >
                <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-[pulse_1.5s_infinite]" />
                <span>🔥 {streak} 連勝</span>
              </motion.div>
            )}

            {/* Score Box */}
            <div className="bg-gray-950 border border-white/10 rounded-xl px-3.5 py-1.5 text-center min-w-[75px] shadow-lg">
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none mb-0.5">
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
                backgroundColor: activeCh.color,
              }}
            />
          </div>
        </div>

        {/* Primary Large Question Card with Beautiful Illustration Header */}
        <div className="w-full bg-gray-900/40 border border-white/5 rounded-2xl p-4 sm:p-5 shrink-0 shadow-2xl backdrop-blur-lg flex-grow flex flex-col justify-center relative overflow-visible">
          
          {/* Running time slider strip at the top of the question card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden rounded-t-2xl">
            <div 
              className="h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${(timeLeft / 20) * 100}%`,
                backgroundColor: timeLeft <= 5 ? "#ef4444" : activeCh.color,
                boxShadow: timeLeft <= 5 ? "0 0 10px #ef4444" : `0 0 10px ${activeCh.color}`,
              }}
            />
          </div>
          
          {/* Question illustration situation context background decoration */}
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full">
            
            {/* Large high-contrast Papercraft illustration representing situation scene directly */}
            <div className="w-full md:w-5/12 aspect-[16/10] md:max-h-[200px] rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-[0_12px_35px_rgba(0,0,0,0.6)] bg-gray-950/80 relative group">
              <img
                src={getQuestionImage(activeCh.id, qIdx, q)}
                alt={`${activeCh.titleZh}情境`}
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${activeCh.color}, transparent 80%)`
                }}
              />
              <div className="absolute left-3 bottom-3 bg-black/70 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-black flex items-center gap-1.5 backdrop-blur-md select-none">
                <BookOpen className="w-3.5 h-3.5" style={{ color: activeCh.color }} />
                <span style={{ color: activeCh.color }}>{activeCh.emoji} 災害現場模擬</span>
              </div>
            </div>

            {/* Question Text block & Answers block */}
            <div className="flex-1 w-full flex flex-col justify-between min-h-full">
              <div className="mb-4">
                {/* Situation Label & Timer */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 select-none">
                  <div className="text-xs text-gray-400 font-black tracking-wide">
                    {activeCh.titleZh} ‧ 第 {qIdx + 1} 題 / 共 {questionsList.length} 題
                  </div>

                  {/* Gigantic glowing countdown badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black text-xs sm:text-sm tracking-widest transition-all duration-300 ${
                    timeLeft <= 5 
                      ? "bg-red-500/25 border-red-500 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                      : "bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                  }`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${timeLeft <= 5 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    </span>
                    <span>⏱️ 倒數 {timeLeft} 秒</span>
                  </div>
                </div>

                {/* Highly Prominent, Extremely clear Question Text */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-wide text-white font-sans drop-shadow-md">
                  {q.q}
                </h2>
              </div>

              {/* Answer Options Grid - Spacious & highly touch target compliant */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {q.opts.map((option, idx) => {
                  return (
                    <motion.button
                      key={idx}
                      disabled={answered}
                      onClick={() => onPickOption(idx)}
                      whileHover={{ scale: 1.01, x: 6 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3.5 border-2 rounded-xl text-left font-black text-sm sm:text-base md:text-lg transition-all duration-200 border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/12 cursor-pointer text-gray-100"
                    >
                      {/* Stylized Option Identifier box */}
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-ops text-sm sm:text-base font-black shrink-0 transition-colors bg-white/15 text-white shadow-inner"
                      >
                        {idx + 1}
                      </div>
                      <div className="leading-snug flex-1 pr-1 font-black">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full shrink-0 border-t border-white/5 pt-3.5">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 border border-white/5 hover:border-white/12 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            中斷，回關卡列表
          </button>
          
          <FullscreenButton />
          
          <div className="text-[10px] font-bold text-gray-500 tracking-wider hidden sm:block">
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
            className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-start px-4 py-8 md:py-12 overflow-y-auto backdrop-blur-2xl bg-slate-950/98"
          >
            {/* Soft background glow based on correctness */}
                      {/* Compact content container */}
            <div className="relative w-full max-w-xl bg-gray-900/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center flex flex-col gap-3.5 my-3 sm:my-5 select-none max-h-[96vh] overflow-y-auto scrollbar-thin">
              
              {/* Confetti details */}
              <div className="absolute top-3 left-4 text-gray-700 animate-spin whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ⚙️ 🌀 ⚡
              </div>
              <div className="absolute top-3 right-4 text-gray-700 animate-bounce whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ✨ ☄️ 🌟
              </div>

              {/* High fidelity inline status & score banner with situational image stamp */}
              <div 
                className={`flex flex-row items-center justify-between gap-3 w-full p-3 rounded-xl text-left border-2 shadow-2xl transition-all duration-300 ${
                  isUserCorrect 
                    ? "bg-emerald-950/90 border-emerald-500/80 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                    : "bg-red-950/90 border-red-500/80 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                }`}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  {isUserCorrect ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                      <span className="font-ops text-lg sm:text-xl md:text-2xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        防護判斷正確！ 🎉
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-6 h-6 shrink-0 text-red-400" />
                      <span className="font-ops text-lg sm:text-xl md:text-2xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        觀念需要修正！ ❌
                      </span>
                    </div>
                  )}

                  {/* Score badge details inside */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 font-extrabold">
                    <Trophy className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
                    <span>獲得積分：</span>
                    <span className={`font-black text-sm sm:text-base ${isUserCorrect ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                      {isUserCorrect ? `+${earnedPoints} FP` : "±0 PT"}
                    </span>
                    {streak >= 2 && isUserCorrect && (
                      <span className="text-orange-400 font-black bg-orange-500/15 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">
                        🔥 連勝 ({streak}連勝)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question-aligned illustration thumbnail stamp */}
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shadow-lg bg-gray-950 flex-shrink-0 relative"
                  style={{ borderColor: activeCh.color }}
                >
                  <img
                    src={getQuestionImage(activeCh.id, qIdx, q)}
                    alt={activeCh.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Slogan */}
              <div className="flex flex-col gap-1.5 items-center mx-auto select-none">
                <div 
                  className="font-ops text-xs sm:text-sm md:text-base font-black tracking-widest py-1 px-4 rounded-xl border-2 w-fit mx-auto"
                  style={{
                    borderColor: `${activeCh.color}60`,
                    color: activeCh.color,
                    backgroundColor: activeCh.glow,
                  }}
                >
                  【 {q.slogan} 】
                </div>
                
                {/* 10s Countdown notice to next slide */}
                <div className="text-gray-200 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  <span>⏱️ 停留</span>
                  <span className="text-yellow-400 font-black text-sm mx-0.5">{timeLeft}</span>
                  <span>秒後，將自動進入下一題！</span>
                </div>
              </div>

              {/* High-visibility QA recap details */}
              <div className="text-left w-full bg-gray-950/90 border-2 border-white/10 rounded-2xl p-3 sm:p-4.5 flex flex-col gap-2.5 shadow-inner">
                {/* Question header */}
                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-cyan-400 font-black tracking-widest uppercase block mb-0.5">QUESTION / 題目情境</span>
                    <span className="text-xs sm:text-sm text-gray-100 font-extrabold leading-normal block">{q.q}</span>
                  </div>
                </div>

                {/* Highly clear correct answer option with number + text */}
                <div className="bg-emerald-500/10 border-2 border-emerald-500/45 p-2.5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 text-black rounded-lg font-ops font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-lg select-none">
                    {q.ans + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase block mb-0.5">
                      CORRECT ANSWER / 正確答案選項
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-emerald-200 font-black leading-snug block">
                      {q.opts[q.ans]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Next Question CTA triggers */}
              <div className="w-full pt-1 flex flex-col gap-2">
                <button
                  onClick={onNextQuestion}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-orange-500 to-red-650 shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-orange-400"
                >
                  <span>
                    {qIdx + 1 >= total 
                      ? `進入關卡成果結算 🏁 (${timeLeft} 秒後自動結算)` 
                      : `理解了，下一題 🚀 (${timeLeft} 秒後自動推進)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                {/* Full screen button inside modal sheet */}
                <FullscreenButton />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

