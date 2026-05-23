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
        <div className="flex items-center justify-between gap-4 w-full bg-gray-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md shrink-0">
          {/* Chapter Icon and Tag Name */}
          <div
            className="px-5 py-2.5 rounded-xl text-sm sm:text-base md:text-lg font-black border shrink-0 uppercase tracking-widest flex items-center gap-2.5 select-none"
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
            <div className="bg-gray-950 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[85px] shadow-lg">
              <div className="text-xs font-black uppercase text-gray-400 tracking-wider leading-none mb-1">
                SCORE
              </div>
              <div className="font-ops text-2xl font-black text-yellow-400 leading-none">
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
        <div className="w-full bg-gray-900/40 border border-white/5 rounded-2xl p-5 sm:p-8 shrink-0 shadow-2xl backdrop-blur-lg flex-grow flex flex-col justify-center relative overflow-visible">
          
          {/* Running time slider strip at the top of the question card */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 overflow-hidden rounded-t-2xl">
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
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 w-full">
            
            {/* Large high-contrast Papercraft illustration representing situation scene directly */}
            <div className="w-full md:w-5/12 aspect-[16/11] sm:aspect-[16/10] md:aspect-square rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-[0_12px_35px_rgba(0,0,0,0.6)] bg-gray-950/80 relative group">
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
              <div className="mb-6">
                {/* Situation Label & Timer */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 select-none">
                  <span
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base font-black uppercase tracking-wider border-2 select-none shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                    style={{
                      borderColor: `${activeCh.color}70`,
                      color: activeCh.color,
                      backgroundColor: activeCh.glow,
                    }}
                  >
                    🎯 題目分類 ‧ {q.scenario}
                  </span>

                  {/* Gigantic glowing countdown badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black text-xs sm:text-sm md:text-base tracking-widest transition-all duration-300 ${
                    timeLeft <= 5 
                      ? "bg-red-500/25 border-red-500 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                      : "bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                  }`}>
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${timeLeft <= 5 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    </span>
                    <span>⏱️ 倒數 {timeLeft} 秒</span>
                  </div>
                </div>

                {/* Highly Prominent, Extremely clear Question Text */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-snug tracking-wide text-white font-sans drop-shadow-md">
                  {q.q}
                </h2>
              </div>

              {/* Answer Options Grid - Spacious & highly touch target compliant */}
              <div className="flex flex-col gap-3.5 sm:gap-4.5">
                {q.opts.map((option, idx) => {
                  return (
                    <motion.button
                      key={idx}
                      disabled={answered}
                      onClick={() => onPickOption(idx)}
                      whileHover={{ scale: 1.01, x: 6 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center gap-4 px-5 py-4 sm:py-5.5 border-2 rounded-xl text-left font-black text-base sm:text-lg md:text-xl transition-all duration-200 border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/12 cursor-pointer text-gray-100"
                    >
                      {/* Stylized Option Identifier box */}
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-ops text-base sm:text-lg md:text-xl font-black shrink-0 transition-colors bg-white/15 text-white shadow-inner"
                      >
                        {idx + 1}
                      </div>
                      <div className="leading-snug flex-1 pr-2 font-black">
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
            className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-start px-4 py-8 md:py-12 overflow-y-auto backdrop-blur-2xl bg-slate-950/98"
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
            <div className="relative w-full max-w-xl bg-gray-900/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.8)] text-center flex flex-col gap-4 my-6 sm:my-10 select-none">
              
              {/* Confetti details */}
              <div className="absolute top-3 left-4 text-gray-700 animate-spin whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ⚙️ 🌀 ⚡
              </div>
              <div className="absolute top-3 right-4 text-gray-700 animate-bounce whitespace-nowrap overflow-hidden pointer-events-none text-xs">
                ✨ ☄️ 🌟
              </div>

              {/* High fidelity inline status & score banner with situational image stamp */}
              <div 
                className={`flex flex-row items-center justify-between gap-4 w-full p-4 rounded-xl text-left border-2 shadow-2xl transition-all duration-300 ${
                  isUserCorrect 
                    ? "bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)]" 
                    : "bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                }`}
              >
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {isUserCorrect ? (
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-400 animate-bounce" />
                      <span className="font-ops text-xl sm:text-2xl md:text-3xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        防護判斷正確！ 🎉
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-red-400">
                      <XCircle className="w-8 h-8 shrink-0 text-red-400 animate-pulse" />
                      <span className="font-ops text-xl sm:text-2xl md:text-3xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        觀念需要修正！ ❌
                      </span>
                    </div>
                  )}

                  {/* Score badge details inside */}
                  <div className="flex items-center gap-2.5 text-sm sm:text-base text-gray-200 font-extrabold">
                    <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
                    <span>獲得積分：</span>
                    <span className={`font-black text-base sm:text-lg ${isUserCorrect ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                      {isUserCorrect ? `+${earnedPoints} FP` : "±0 PT"}
                    </span>
                    {streak >= 2 && isUserCorrect && (
                      <span className="text-orange-400 font-black bg-orange-500/15 px-2 py-0.5 rounded text-xs sm:text-sm">
                        🔥 連勝加成中 ({streak}連勝)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question-aligned illustration thumbnail stamp */}
                <div 
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg bg-gray-950 flex-shrink-0 relative group animate-pulse"
                  style={{ borderColor: activeCh.color }}
                >
                  <img
                    src={getQuestionImage(activeCh.id, qIdx, q)}
                    alt={activeCh.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-1 bottom-1 bg-black/60 rounded px-1.5 py-[1px] text-[11px] text-white leading-none font-bold">
                    {activeCh.emoji}
                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div className="flex flex-col gap-2 items-center mx-auto select-none">
                <div 
                  className="font-ops text-sm sm:text-base md:text-lg font-black tracking-widest py-1.5 px-6 rounded-xl border-2 w-fit mx-auto"
                  style={{
                    borderColor: `${activeCh.color}60`,
                    color: activeCh.color,
                    backgroundColor: activeCh.glow,
                  }}
                >
                  【 {q.slogan} 】
                </div>
                
                {/* 10s Countdown notice to next slide */}
                <div className="text-gray-200 font-extrabold text-sm sm:text-base flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full shadow-lg animate-pulse">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                  </span>
                  <span>⏱️ 停留</span>
                  <span className="text-yellow-400 font-black text-lg mx-0.5">{timeLeft}</span>
                  <span>秒後，將自動進入下一題！</span>
                </div>
              </div>

              {/* High-visibility QA recap details */}
              <div className="text-left w-full bg-gray-950/90 border-2 border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col gap-3.5 shadow-inner">
                {/* Question header */}
                <div className="flex items-start gap-2.5 border-b border-white/5 pb-3">
                  <GraduationCap className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-cyan-400 font-black tracking-widest uppercase block mb-0.5">QUESTION / 題目情境</span>
                    <span className="text-sm sm:text-base text-gray-100 font-extrabold leading-relaxed block">{q.q}</span>
                  </div>
                </div>

                {/* Highly clear correct answer option with number + text */}
                <div className="bg-emerald-500/10 border-2 border-emerald-500/45 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 text-black rounded-xl font-ops font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-lg select-none">
                    {q.ans + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-emerald-400 font-black tracking-widest uppercase block mb-1">
                      CORRECT ANSWER / 正確答案選項
                    </span>
                    <span className="text-base sm:text-lg md:text-xl text-emerald-200 font-black leading-snug block">
                      {q.opts[q.ans]}
                    </span>
                  </div>
                </div>

                {/* If wrong, user choice comparison */}
                {!isUserCorrect && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-xl font-ops font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-lg select-none">
                      {selectedOption !== null && selectedOption >= 0 ? selectedOption + 1 : "⌛"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-red-500 font-black tracking-widest uppercase block mb-1">
                        YOUR CHOICE / 您的選擇
                      </span>
                      <span className="text-sm sm:text-base md:text-lg text-red-100 font-extrabold leading-snug block">
                        {selectedOption !== null && selectedOption >= 0 
                          ? q.opts[selectedOption] 
                          : "答題超時未作答 (逾時)"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Explanatory description */}
              <div className="text-left w-full bg-slate-900/60 border border-white/10 p-4 sm:p-5 rounded-xl shadow-md">
                <span className="text-xs sm:text-sm text-blue-400 font-black tracking-widest uppercase block mb-1.5 flex items-center gap-1.5 select-none">
                  💡 防災必修課 ‧ 核心觀念解析
                </span>
                <p className="text-gray-200 text-sm sm:text-base md:text-lg font-bold leading-relaxed whitespace-pre-line pl-1 border-l-2 border-blue-500/40">
                  {q.exp}
                </p>
              </div>

              {/* Bottom Next Question CTA triggers */}
              <div className="w-full pt-2">
                <button
                  onClick={onNextQuestion}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base sm:text-lg font-black text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_4px_20px_rgba(249,115,22,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-orange-400"
                >
                  <span>
                    {qIdx + 1 >= total 
                      ? `進入關卡成果結算 🏁 (${timeLeft} 秒後自動結算)` 
                      : `理解了，下一題 🚀 (${timeLeft} 秒後自動推進)`}
                  </span>
                  <ArrowRight className="w-5 h-5 animate-bounce" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

