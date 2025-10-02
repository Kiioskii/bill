import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AgentModule } from 'src/agent/agent.module';
import { QuizzesController } from './quizzes.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
  imports: [AgentModule, FilesModule],
})
export class QuizzesModule {}
