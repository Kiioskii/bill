import { AgentService } from './../agent/agent.service';
import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';
import { CreateQuizDto } from './dto/create-quiz-dto';
import { FilesService } from 'src/files/files.service';
import { ListQuizDto } from './dto/list-quiz-dto';
import { Quiz } from './dto/quiz-dto';
import { PostgrestError } from '@supabase/supabase-js';
import { ListQuizResponse } from './dto/list-quiz-response';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly agentService: AgentService,
    private readonly fileService: FilesService,
  ) {}

  async createQuiz(dto: CreateQuizDto) {
    try {
      const {
        userId,
        title,
        description,
        fileIds,
        questionsCount,
        difficulty,
        icon,
        color,
      } = dto;

      const promiseArr = fileIds.map(async (fileId) => {
        const fileName = `${userId}/${fileId}`;
        const { docs } = await this.fileService.processFile(
          fileName,
          userId!,
          4500,
        );
        const quiz = await this.agentService.generateQuiz(
          title,
          description,
          docs,
        );
        return quiz;
      });

      const quizArr = await Promise.all(promiseArr);
      const count: number = quizArr
        .flat()
        .reduce((acc, item) => acc + (item?.quiz?.length ?? 0), 0);

      const quizRow = {
        owner_id: dto.userId!,
        title,
        description,
        data: quizArr.flat(),
        questions_count: count,
        file_ids: dto.fileIds,
        color,
        icon,
        difficulty,
      };

      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizRow])
        .select()
        .single();

      if (error || !data) {
        console.log('error', error);
        throw new Error(error?.message);
      }

      const quizData = {
        user_id: userId,
        quiz_id: data.id,
      };

      const quizPromiseArr = [
        supabase.from('favorite_quizzes').insert([quizData]),
        supabase.from('quiz_progress').insert([quizData]),
      ];

      const x = await Promise.all(quizPromiseArr);
      console.log('x', x);
    } catch (err: any) {
      console.log('err', err);
      throw new Error(err?.message || 'Create new quiz failed');
    }
  }

  async listQuiz(dto: ListQuizDto): Promise<ListQuizResponse[]> {
    try {
      const {
        data,
        error,
      }: { data: ListQuizResponse[] | null; error: PostgrestError | null } =
        await supabase
          .from('quizzes')
          .select(
            'id, title, description, questions_count, color, icon, difficulty, quiz_progress( answered_count)',
          )
          .eq('owner_id', dto.userId);

      const {
        data: favData,
        error: FavError,
      }: { data: { quiz_id: string }[] | null; error: PostgrestError | null } =
        await supabase
          .from('favorite_quizzes')
          .select('quiz_id')
          .eq('user_id', dto.userId)
          .eq('favorite', true);

      if (error || !data || FavError) {
        console.error('Supabase error: ', error?.message);
        throw new Error(error?.message || 'Supabase list quizzes error');
      }

      const favoriteQuizzes = favData?.map((item) => item.quiz_id);
      const response = data?.map((item) => {
        return {
          ...item,
          isFavorite: favoriteQuizzes?.includes(item.id),
        };
      });

      return response;
    } catch (err: any) {
      if (err instanceof Error) {
        console.error('Unexpected error: ', err.message);
        throw err;
      }
      throw new Error('Unknown error occurred while listing quizzes');
    }
  }

  async toggleFavorite(dto: {
    userId: string;
    quizId: string;
    isFavorite: boolean;
  }) {
    try {
      const { userId, quizId, isFavorite } = dto;

      const { data, error } = await supabase
        .from('favorite_quizzes')
        .update({ favorite: isFavorite })
        .eq('user_id', userId)
        .eq('quiz_id', quizId);

      if (error) {
        throw new Error(error?.message || 'Add to favorites supabase error');
      }
      return data;
    } catch (err: any) {
      console.error('err', err);
      throw new Error(err?.message || 'Add to favorites failed');
    }
  }

  async getQuizData(dto: { userId: string; quizId: string }) {
    const { quizId } = dto;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(
          'title, data,icon, color, questions_count, quiz_progress( answered_count )',
        )
        .eq('id', quizId);

      if (error) {
        throw new Error(error?.message || 'Get quiz data failed');
      }

      console.log('data', data[0]);

      const questions = data[0].data.reduce((acc, item) => {
        return item.quiz;
      }, []);

      const progress = data[0]?.quiz_progress[0]?.answered_count;

      const response = {
        ...data[0],
        questions,
        progress,
      };

      return response;
    } catch (err: any) {
      console.error('err', err);
      throw new Error(err?.message || 'Add to favorites failed');
    }
  }

  async makeProgress(data: {
    userId: string;
    quizId: string;
    progress: number;
  }) {
    console.log('makeProgress', data);
    const { userId, quizId, progress } = data;
    try {
      const { error } = await supabase
        .from('quiz_progress')
        .update({ answered_count: +progress })
        .eq('user_id', userId)
        .eq('quiz_id', quizId);

      console.log('error', error);

      if (error) {
        throw new Error(error?.message || 'Get quiz data failed');
      }
      return;
    } catch (err: any) {
      console.error('err', err);
      throw new Error(err?.message || 'Add to favorites failed');
    }
  }
}
