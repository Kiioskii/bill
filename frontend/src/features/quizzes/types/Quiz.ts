export type CreateQuizPayload = {
  title: string;
  fileIds: number[];
  difficulty: string;
  description: string;
  questionsCount: string;
  color: string | null;
  icon: string | null;
};
