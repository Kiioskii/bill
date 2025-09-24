import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';

@Injectable()
export class QuizzesService {
  private readonly logger = new Logger(QuizzesService.name);

  async createQuiz(
    numberOfQuestions: number = 10,
    fileIdArr: Array<string> = [],
    title: string = '',
    description: string = '',
    userId: string,
  ) {
    try {
      for (const fileId of fileIdArr) {
        const { data, error } = await supabase.storage
          .from('documents')
          .download(`${userId}/${fileId}`);
        if (error || !data) {
          throw new Error('Create quiz failed');
        }
        const arrayBuffer = await data.arrayBuffer();
      }
    } catch (err) {}
  }
}
