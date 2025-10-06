import { AgentService } from './../agent/agent.service';
import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';
import { CreateQuizDto } from './dto/create-quiz-dto';
import { FilesService } from 'src/files/files.service';
import { ListQuizDto } from './dto/list-quiz-dto';
import { Quiz } from './dto/quiz-dto';
import { PostgrestError } from '@supabase/supabase-js';

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

      const quizRow = {
        user_id: dto.userId!,
        title: dto.title,
        description: dto.description,
        data: quizArr.flat(),
        file_ids: dto.fileIds,
      };

      const { data, error } = await supabase.from('quizzes').insert([quizRow]);
      if (error) {
        console.log('error', error);
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.log('err', err);
      throw new Error(err?.message || 'Create new quiz failed');
    }
  }

  async listQuiz(dto: ListQuizDto): Promise<Quiz[]> {
    try {
      const {
        data,
        error,
      }: { data: Quiz[] | null; error: PostgrestError | null } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', dto.userId);

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
}
