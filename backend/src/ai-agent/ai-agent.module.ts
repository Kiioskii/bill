import { Module } from '@nestjs/common';
import { OpenAIService } from './tokenizer.service';

@Module({
  providers: [OpenAIService],
  exports: [OpenAIService], // jeśli chcesz używać w innych modułach
})
export class AiAgentModule {}
