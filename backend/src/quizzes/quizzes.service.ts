import { AgentService } from './../agent/agent.service';
import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';
import { CreateQuizDto } from './dto/create-quiz-dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly agentService: AgentService,
    private readonly fileService: FilesService,
  ) {}
  private readonly logger = new Logger(QuizzesService.name);
  private readonly model = 'gpt-4o';
  private readonly maxTokens = 1000;
  private readonly overlap = 200;

  // async createQuiz(dto: CreateQuizDto) {

  //   const { userId, title, description, fileIds, questionsCount, difficulty } =
  //     dto;

  //   try {
  //     const fileChunks: string[] = [];

  //     const promiseArr = fileIds.map(async (fileId) => {
  //       const { data, error } = await supabase.storage
  //         .from('documents')
  //         .download(`${userId}/${fileId}`);

  //       if (error || !data) {
  //         console.log('promise error', error);
  //         throw new Error('Create quiz failed');
  //       }
  //       const arrayBuffer = await data.arrayBuffer();
  //       const text = new TextDecoder('utf-8').decode(arrayBuffer);
  //       const clearText = this.agentService.clearText(text);

  //       const chunks = await this.agentService.chunkTextByTokens(
  //         clearText,
  //         this.model,
  //         this.maxTokens,
  //         this.overlap,
  //       );
  //       fileChunks.push(...chunks);
  //     });

  //     await Promise.all(promiseArr);

  //     console.log('--------------------');

  //     const batchSize = 3; // np. max 3 chunki na request
  //     const batches = this.agentService.splitIntoBatches(fileChunks, batchSize);
  //     const questionsPerBatch = Number.isNaN(+questionsCount)
  //       ? questionsCount
  //       : Math.ceil(+questionsCount / batches.length);

  //     const allQuestions: any[] = [];

  //     console.log('batches.length', batches.length);

  //     for (const batch of batches) {
  //       console.log('batch', batch);

  //       // const messages = await this.agentService.quizPrompt(
  //       //   batch,
  //       //   questionsPerBatch,
  //       // );

  //       // const response: any = await this.agentService.completion(
  //       //   messages,
  //       //   this.model,
  //       //   false,
  //       //   true,
  //       // );
  //       // // console.log('response', response.choices[0].message);
  //       // try {
  //       //   const quizPart = JSON.parse(response.choices[0].message.content);
  //       //   if (quizPart?.quiz) {
  //       //     allQuestions.push(...quizPart.quiz);
  //       //   }
  //       // } catch (err) {
  //       //   console.error('Błąd parsowania odpowiedzi quizu:', err);
  //       // }
  //     }
  //   } catch (err: any) {
  //     console.log('err', err);
  //     throw new Error(err?.message || 'Create new quiz failed');
  //   }
  // }

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
}
