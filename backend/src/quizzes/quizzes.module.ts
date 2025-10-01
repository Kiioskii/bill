import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AgentModule } from 'src/agent/agent.module';
import { QuizzesController } from './quizzes.controller';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
  imports: [AgentModule, FilesService],
})
export class QuizzesModule {}
