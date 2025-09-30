type QuestionsCount = 'Auto' | '10' | '20' | '30' | '50' | '70' | '100';
type Difficulty = 'Beginner' | 'Junior' | 'Mid' | 'Advanced' | 'Expert';

export interface CreateQuizDto {
  userId?: string;
  title: string;
  description: string;
  fileIds: string[];
  questionsCount: QuestionsCount;
  difficulty: Difficulty;
}
