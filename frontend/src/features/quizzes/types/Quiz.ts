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
