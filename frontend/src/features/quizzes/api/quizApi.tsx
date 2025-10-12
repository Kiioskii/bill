import api from "@/api/api";
import type { CreateQuizPayload } from "../types/Quiz";

export const createQuiz = async (data: CreateQuizPayload) => {
    const response = await api.post("quizzes/create", data);
    return response.data;
};

export const listQuiz = async () => {
    const response = await api.get("quizzes/list");
    return response.data;
};

export const toggleFavoriteRequest = async (data: { quizId: string; isFavorite: boolean }) => {
    const response = await api.post("quizzes/toggleFavorite", data);
    return response.data;
};

export const getQuizDataRequest = async (quizId: string) => {
    const response = await api.get("quizzes/getQuizData", {
        params: { quizId },
    });
    return response.data;
};

export const makeQuizProgressRequest = async (data: { quizId: string; progress: number }) => {
    const { quizId, progress } = data;
    console.log("makeQuizProgressRequest", data);
    const response = await api.get("quizzes/makeProgress", {
        params: { quizId, progress },
    });
    return response.data;
};

export const setFavoriteQuestion = async (data: { quizId: string; question: number }) => {
    const { quizId, question } = data;
    const response = await api.get("quizzes/setFavoriteQuestion", {
        params: { quizId, question },
    });
    return response.data;
};

export const unsetFavoriteQuestion = async (data: { quizId: string; question: number }) => {
    const { quizId, question } = data;
    const response = await api.get("quizzes/unsetFavoriteQuestion", {
        params: { quizId, question },
    });
    return response.data;
};
