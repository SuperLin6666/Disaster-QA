/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  scenario: string;
  q: string;
  opts: string[];
  ans: number;
  slogan: string;
  exp: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleZh: string;
  emoji: string;
  color: string;
  glow: string;
  cls: string;
  questions: Question[];
}

export interface ChapterResult {
  correct: number;
  wrong: number;
  pts: number;
  total: number;
}

export interface GameState {
  score: number;
  streak: number;
  chIdx: number;
  qIdx: number;
  chCorrect: number;
  chWrong: number;
  answered: boolean;
  selectedOption: number | null;
  results: Record<string, ChapterResult>;
  done: string[];
}

export type ScreenType = "home" | "chapters" | "question" | "levelComplete" | "final";
