import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [AgentModule],
  providers: [QuizzesService],
})
export class QuizzesModule {}
