import { AgentService } from './../agent/agent.service';
import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';

@Injectable()
export class QuizzesService {
  constructor(private readonly agentService: AgentService) {}
  private readonly logger = new Logger(QuizzesService.name);
  private readonly model = 'gpt-4o';
  private readonly maxTokens = 1000;
  private readonly overlap = 1000;

  async createQuiz(
    userId: string,
    title: string = '',
    fileIdArr: Array<string> = [],
    sectionsCount: number = 10,
    description: string = '',
  ) {
    try {
      const fileChunks: string[] = [];

      // for (const fileId of fileIdArr) {
      //   const { data, error } = await supabase.storage
      //     .from('documents')
      //     .download(`${userId}/${fileId}`);

      //   if (error || !data) {
      //     throw new Error('Create quiz failed');
      //   }
      //   const arrayBuffer = await data.arrayBuffer();
      //   const text = new TextDecoder('utf-8').decode(arrayBuffer);
      //   const chunks = await this.agentService.chunkTextByTokens(
      //     text,
      //     this.model,
      //     this.maxTokens,
      //     this.overlap,
      //   );
      //   fileChunks.push(...chunks);
      // }

      const promiseArr = fileIdArr.map(async (fileId) => {
        const { data, error } = await supabase.storage
          .from('documents')
          .download(`${userId}/${fileId}`);

        if (error || !data) {
          throw new Error('Create quiz failed');
        }
        const arrayBuffer = await data.arrayBuffer();
        const text = new TextDecoder('utf-8').decode(arrayBuffer);
        const chunks = await this.agentService.chunkTextByTokens(
          text,
          this.model,
          this.maxTokens,
          this.overlap,
        );
        fileChunks.push(...chunks);
      });

      await Promise.all(promiseArr);

      const messages = await this.agentService.quizPrompt(
        fileChunks,
        sectionsCount,
      );
      const response = await this.agentService.completion(
        messages,
        this.model,
        false,
        true,
      );

      // const newRow = {
      //   user_id: userId,
      //   title,
      //   description,
      //   data: response
      // };

      // const { data, error } = await supabase.from('quizzes').insert();

      console.log(response);
    } catch (err) {
      console.log('err', err);
    }
  }
}
