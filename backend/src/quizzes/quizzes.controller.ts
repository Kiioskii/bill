import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
    const response = await this.quizzesService.createQuiz({ ...body, userId });
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('list')
  async listQuiz(@User('sub') userId: string, @Body() body) {
    const data = { userId };
    const response = await this.quizzesService.listQuiz(data);
    return response;
  }
}
