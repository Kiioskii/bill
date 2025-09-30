import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard';
import { User } from 'src/auth/auth.decorator';
import type { CreateQuizDto } from './dto/create-quiz-dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @UseGuards(SupabaseJwtGuard)
  @Post('create')
  async createQuiz(@User('sub') userId: string, @Body() body: CreateQuizDto) {
    const x = await this.quizzesService.createQuiz({ ...body, userId });
    console.log('x', x);
    return x;
  }
}
