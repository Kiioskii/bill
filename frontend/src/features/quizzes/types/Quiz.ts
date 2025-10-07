type Difficulty = "beginner" | "easy" | "medium" | "hard" | "expert";

export type CreateQuizPayload = {
    title: string;
    fileIds: number[];
    difficulty: Difficulty;
    description: string;
    questionsCount: string;
    color: string | null;
    icon: string | null;
};

export type ListQuizData = {
    id: string;
    title: string;
    color: string | null;
    description: string;
    difficulty: Difficulty;
    icon: string | null;
    favorite_quizzes: { user_id: string }[];
    questions_count: number;
};
