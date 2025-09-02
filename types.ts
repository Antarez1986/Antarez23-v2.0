
export enum Difficulty {
  Bajo = "Bajo",
  Medio = "Medio",
  Alto = "Alto",
}

export interface FormData {
  studentName: string;
  grade: string;
  topic: string;
  textType: string;
  difficulty: Difficulty;
  additionalDetails: string;
  preferences: string[];
  characterCount: number;
  saberQuestionCount: number;
  extraActivities: string[];
}

export interface SaberQuestion {
  context: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface MatchingExercise {
  columnA: string[];
  columnB: string[];
}

export interface CreativeActivity {
  title: string;
  description: string;
}

export interface ExtraActivity {
    title: string;
    content: string;
}

export interface Workshop {
  saberQuestions: SaberQuestion[];
  matchingExercise: MatchingExercise;
  openQuestions: string[];
  creativeActivity: CreativeActivity;
  conceptMapFacts: string[];
  extraActivities: ExtraActivity[];
}

export interface Narrative {
  title: string;
  text: string; // Contendrá placeholders como [VIGNETTE_1]
  coverImage: string; // Base64 string
  vignetteImages: string[]; // Array de Base64 strings
}

export interface GeneratedContent {
  narrative: Narrative;
  workshop: Workshop;
}
