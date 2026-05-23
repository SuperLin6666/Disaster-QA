/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { CHAPTERS, prepareChapterQuestions, prepareMixedQuestions } from "./data";
import { ScreenType, GameState, ChapterResult } from "./types";

import BackgroundCanvas from "./components/BackgroundCanvas";
import HomeScreen from "./components/HomeScreen";
import ChapterSelectScreen from "./components/ChapterSelectScreen";
import QuestionScreen from "./components/QuestionScreen";
import LevelCompleteScreen from "./components/LevelCompleteScreen";
import FinalScreen from "./components/FinalScreen";

const LOCAL_STORAGE_KEY = "disaster_survival_quiz_state_v1";

const MIXED_CHAPTER = {
  id: "mixed_pk",
  title: "Mixed Challenge",
  titleZh: "隨機綜合挑戰",
  emoji: "🏆",
  color: "#f59e0b",
  glow: "rgba(245,158,11,0.12)",
  cls: "mixed",
  questions: [],
};

const initialGameState: GameState = {
  score: 0,
  streak: 0,
  chIdx: 0,
  qIdx: 0,
  chCorrect: 0,
  chWrong: 0,
  answered: false,
  selectedOption: null,
  results: {},
  done: [],
};

export default function App() {
  const [screen, setScreen] = useState<ScreenType>("home");
  const [state, setState] = useState<GameState>(initialGameState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GameState;
        // Basic type validation
        if (parsed && typeof parsed.score === "number") {
          setState((prev) => ({
            ...prev,
            score: parsed.score || 0,
            streak: parsed.streak || 0,
            results: parsed.results || {},
            done: parsed.done || [],
          }));
        }
      }
    } catch (e) {
      console.warn("Could not parse saved survival game state: ", e);
    }
  }, []);

  // Save changes to localStorage
  const saveStateToStorage = (updatedState: GameState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedState));
    } catch (e) {
      console.warn("Failed to store survival status: ", e);
    }
  };

  const handleStartQuiz = () => {
    setScreen("chapters");
  };

  const handleSelectChapter = (chIndex: number) => {
    const shuffled = chIndex === -1
      ? prepareMixedQuestions()
      : prepareChapterQuestions(CHAPTERS[chIndex].questions);

    const updated = {
      ...state,
      chIdx: chIndex,
      qIdx: 0,
      chCorrect: 0,
      chWrong: 0,
      answered: false,
      selectedOption: null,
      activeQuestions: shuffled,
    };
    setState(updated);
    saveStateToStorage(updated);
    setScreen("question");
  };

  const handleGoBack = () => {
    setScreen("home");
  };

  const handlePickOption = (optionIdx: number) => {
    if (state.answered) return;

    const currentChapter = state.chIdx === -1 ? MIXED_CHAPTER : CHAPTERS[state.chIdx];
    const questionsList = state.activeQuestions || currentChapter.questions;
    const currentQuestion = questionsList[state.qIdx];
    const isCorrect = optionIdx === currentQuestion.ans;

    let nextCorrectCount = state.chCorrect;
    let nextWrongCount = state.chWrong;
    let nextStreak = state.streak;
    let nextScore = state.score;

    if (isCorrect) {
      nextCorrectCount += 1;
      nextStreak += 1;
      // Gamified score bonus matching user logic: Math.min((streak - 1) * 5, 20)
      const bonus = Math.min((nextStreak - 1) * 5, 20);
      const earnedPoints = 10 + bonus;
      nextScore += earnedPoints;
    } else {
      nextWrongCount += 1;
      nextStreak = 0; // Streak breaks
    }

    const updated = {
      ...state,
      chCorrect: nextCorrectCount,
      chWrong: nextWrongCount,
      streak: nextStreak,
      score: nextScore,
      answered: true,
      selectedOption: optionIdx,
    };

    setState(updated);
    saveStateToStorage(updated);
  };

  const handleNextQuestion = () => {
    const currentChapter = state.chIdx === -1 ? MIXED_CHAPTER : CHAPTERS[state.chIdx];
    const questionsList = state.activeQuestions || currentChapter.questions;
    const nextQIdx = state.qIdx + 1;

    if (nextQIdx >= questionsList.length) {
      // Completed last question of the current chapter!
      const chapterId = currentChapter.id;
      const updatedDone = state.done.includes(chapterId)
        ? state.done
        : [...state.done, chapterId];

      const newResult: ChapterResult = {
        correct: state.chCorrect,
        wrong: state.chWrong,
        pts: state.score,
        total: questionsList.length,
      };

      const updatedResults = {
        ...state.results,
        [chapterId]: newResult,
      };

      const finalState = {
        ...state,
        done: updatedDone,
        results: updatedResults,
        answered: false,
        selectedOption: null,
      };

      setState(finalState);
      saveStateToStorage(finalState);
      setScreen("levelComplete");
    } else {
      // Advance to the next question within chapter
      setState((prev) => ({
        ...prev,
        qIdx: nextQIdx,
        answered: false,
        selectedOption: null,
      }));
    }
  };

  const handleStartNextChapter = () => {
    const nextChIdx = state.chIdx + 1;
    if (nextChIdx < CHAPTERS.length) {
      handleSelectChapter(nextChIdx);
    } else {
      handleShowFinalResults();
    }
  };

  const handleShowFinalResults = () => {
    setScreen("final");
  };

  const handleReset = () => {
    setState(initialGameState);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setScreen("home");
  };

  // Compute helpers
  const totalCorrect = (Object.values(state.results) as ChapterResult[]).reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = (Object.values(state.results) as ChapterResult[]).reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="relative min-h-screen text-gray-100 overflow-hidden font-sans">
      {/* Immersive Particle Node Background */}
      <BackgroundCanvas />

      {/* Main screens layer layout */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <HomeScreen
              key="home-screen"
              chapters={CHAPTERS}
              onStartQuiz={handleStartQuiz}
              onSelectChapter={handleSelectChapter}
              onStartMixedChallenge={() => handleSelectChapter(-1)}
              totalScore={state.score}
              totalCorrect={totalCorrect}
              totalQuestions={totalQuestions}
            />
          )}

          {screen === "chapters" && (
            <ChapterSelectScreen
              key="chapter-select"
              chapters={CHAPTERS}
              onSelectChapter={handleSelectChapter}
              onGoBack={handleGoBack}
              onShowFinalResults={handleShowFinalResults}
              onReset={handleReset}
              doneChapters={state.done}
              results={state.results}
              totalScore={state.score}
              totalCorrect={totalCorrect}
              streak={state.streak}
            />
          )}

          {screen === "question" && (
            <QuestionScreen
              key="question-screen"
              chapter={state.chIdx === -1 ? MIXED_CHAPTER : CHAPTERS[state.chIdx]}
              activeQuestions={state.activeQuestions}
              qIdx={state.qIdx}
              streak={state.streak}
              score={state.score}
              answered={state.answered}
              selectedOption={state.selectedOption}
              onPickOption={handlePickOption}
              onNextQuestion={handleNextQuestion}
              onExit={() => setScreen(state.chIdx === -1 ? "home" : "chapters")}
            />
          )}

          {screen === "levelComplete" && (
            <LevelCompleteScreen
              key="complete-screen"
              chapter={state.chIdx === -1 ? MIXED_CHAPTER : CHAPTERS[state.chIdx]}
              correctCount={state.chCorrect}
              wrongCount={state.chWrong}
              currentScore={state.score}
              nextChapter={
                state.chIdx !== -1 && state.chIdx + 1 < CHAPTERS.length ? CHAPTERS[state.chIdx + 1] : null
              }
              onGoToChapters={() => setScreen("chapters")}
              onStartNextChapter={handleStartNextChapter}
              onShowFinalResults={handleShowFinalResults}
            />
          )}

          {screen === "final" && (
            <FinalScreen
              key="final-screen"
              chapters={CHAPTERS}
              score={state.score}
              results={state.results}
              onReset={handleReset}
              onGoToChapters={() => setScreen("chapters")}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
