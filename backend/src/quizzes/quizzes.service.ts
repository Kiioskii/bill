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
            'title, description, questions_count, color, icon, difficulty',
          )
          .eq('owner_id', dto.userId);

      if (error || !data) {
        console.error('Supabase error: ', error?.message);
        throw new Error(error?.message || 'Supabase list quizzes error');
      }

      return data;
    } catch (err: any) {
      if (err instanceof Error) {
        console.error('Unexpected error: ', err.message);
        throw err;
      }
      throw new Error('Unknown error occurred while listing quizzes');
    }
  }

  async addToFavorites(userId: string, quizId: string) {
    try {
      const dataToInsert = {
        user_id: userId,
        quiz_id: quizId,
      };
      const { data, error } = await supabase
        .from('favorite_quizzes')
        .insert([dataToInsert]);

      if (error || !data) {
        throw new Error(error?.message || 'Add to favorites supabase error');
      }
      return data;
    } catch (err: any) {
      console.log('err', err);
      throw new Error(err?.message || 'Add to favorites failed');
    }
  }
}
