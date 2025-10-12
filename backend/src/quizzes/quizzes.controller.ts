import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  async listQuiz(@User('sub') userId: string) {
    const data = { userId };
    const response = await this.quizzesService.listQuiz(data);
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Post('toggleFavorite')
  async toggleFavorite(
    @User('sub') userId: string,
    @Body() body: { quizId: string; isFavorite: boolean },
  ) {
    const { quizId, isFavorite } = body;
    const data = { userId, quizId, isFavorite };
    const response = await this.quizzesService.toggleFavorite(data);
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('getQuizData')
  async getQuizData(
    @User('sub') userId: string,
    @Query('quizId') quizId: string,
  ) {
    const data = { userId, quizId };
    const response = await this.quizzesService.getQuizData(data);
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('makeProgress')
  async makeProgress(
    @User('sub') userId: string,
    @Query('quizId') quizId: string,
    @Query('progress') progress: number,
  ) {
    const data = { userId, quizId, progress };
    const response = await this.quizzesService.makeProgress(data);
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('setFavoriteQuestion')
  async setFavoriteQuestion(
    @User('sub') userId: string,
    @Query('quizId') quizId: string,
    @Query('question') question: number,
  ) {
    const data = { userId, quizId, question };
    const response = await this.quizzesService.setFavoriteQuestion(data);
    return response;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('unsetFavoriteQuestion')
  async unsetFavoriteQuestion(
    @User('sub') userId: string,
    @Query('quizId') quizId: string,
    @Query('question') question: number,
  ) {
    const data = { userId, quizId, question };
    const response = await this.quizzesService.unsetFavoriteQuestion(data);
    return response;
  }
}
