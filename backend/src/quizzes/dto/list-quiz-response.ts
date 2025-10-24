type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface ListQuizResponse {
  id: string;
  title: string;
  description: string;
  questions_count: number;
  difficulty: Difficulty;
  color: string | null;
  icon: string | null;
  // Added fields for UI needs
  quiz_progress?: { answered_count: number }[];
  isFavorite?: boolean;
  completed?: boolean;
}
