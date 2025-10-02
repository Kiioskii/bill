import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { createByModelName } from '@microsoft/tiktokenizer';
import { Logger } from '@nestjs/common';
import { IDoc } from 'src/text/text.service';
import { systemPrompt } from 'src/quizzes/prompts/systemPrompt';

export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private openai: OpenAI;
  private tokenizers: Map<
    string,
    Awaited<ReturnType<typeof createByModelName>>
  > = new Map();
  private readonly IM_START = '<|im_start|>';
  private readonly IM_END = '<|im_end|>';
  private readonly IM_SEP = '<|im_sep|>';

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async getTokenizer(modelName: string) {
    if (!this.tokenizers.has(modelName)) {
      const specialTokens: ReadonlyMap<string, number> = new Map([
        [this.IM_START, 100264],
        [this.IM_END, 100265],
        [this.IM_SEP, 100266],
      ]);
      const tokenizer = await createByModelName(modelName, specialTokens);
      this.tokenizers.set(modelName, tokenizer);
    }
    return this.tokenizers.get(modelName)!;
  }

  async countTokens(
    messages: ChatCompletionMessageParam[],
    model: string = 'gpt-4o',
  ): Promise<number> {
    const tokenizer = await this.getTokenizer(model);

    let formattedContent = '';
    messages.forEach((message) => {
      formattedContent += `${this.IM_START}${message.role}${this.IM_SEP}${message.content || ''}${this.IM_END}`;
    });
    formattedContent += `${this.IM_START}assistant${this.IM_SEP}`;

    const tokens = tokenizer.encode(formattedContent, [
      this.IM_START,
      this.IM_END,
      this.IM_SEP,
    ]);
    return tokens.length;
  }

  async completion(
    messages: ChatCompletionMessageParam[],
    model: string = 'gpt-4',
    stream: boolean = false,
    jsonMode: boolean = false,
    maxTokens: number = 8096,
  ): Promise<
    | OpenAI.Chat.Completions.ChatCompletion
    | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  > {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        stream,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      });

      return stream
        ? (chatCompletion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>)
        : (chatCompletion as OpenAI.Chat.Completions.ChatCompletion);
    } catch (error) {
      this.logger.error('Error in OpenAI completion:', error);
      throw error;
    }
  }

  async chunkTextByTokens(
    text: string,
    model: string = 'gpt-4o',
    maxTokens: number = 1000,
    overlap: number = 200,
  ) {
    // 2. Tokenizacja
    const tokenizer = await this.getTokenizer(model);
    const tokens = tokenizer.encode(text);
    const chunks: string[] = [];

    let start = 0;
    while (start < tokens.length) {
      const end = Math.min(start + maxTokens, tokens.length);
      const chunkTokens = tokens.slice(start, end);

      // 3. Dekoduj
      let chunk = tokenizer.decode(chunkTokens);

      // 4. Spróbuj przyciąć na końcu zdania (lepszy kontekst)
      const lastSentenceEnd = Math.max(
        chunk.lastIndexOf('.'),
        chunk.lastIndexOf('?'),
        chunk.lastIndexOf('!'),
      );
      if (lastSentenceEnd > 0 && end < tokens.length) {
        chunk = chunk.slice(0, lastSentenceEnd + 1);
      }

      chunks.push(chunk);

      // 5. Przesuwaj się z overlappem
      start += maxTokens - overlap;
    }

    return chunks;
  }

  splitIntoBatches<T>(arr: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
  }

  clearText(raw: string): string {
    return (
      raw
        // usuń numery stron w stylu "Page 1", "Strona 3 z 50"
        .replace(/(Page|Strona)\s+\d+(\s+z\s+\d+)?/gi, '')

        // usuń powtarzalne stopki (np. copyright, nazwa firmy, itp.)
        .replace(/©.*\n/g, '')

        // usuń nagłówki/stopki w wersji ALL CAPS
        .replace(/^[A-Z\s]{5,}\n/gm, '')

        // usuń puste linie powstałe po czyszczeniu
        .replace(/\n{2,}/g, '\n')
        .trim()
    );
  }

  async quizPrompt(fileArr: string[], sectionsCount: string | number) {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `
 <prompt_objective>
Generate a quiz based on the provided files.  
The quiz should consist of a specified number of sections.  
Each section must include one question and four possible answers, with exactly one correct answer and three incorrect ones.  
</prompt_objective>

<prompt_rules>
- All questions and answers must be strictly based on the content of the files.  
- Do not invent or add information that is not present in the files.  
- The correct answer must be directly supported by the files.  
- The three incorrect answers should be plausible but factually incorrect according to the files.  
- The number of quiz sections must exactly match the parameter 'sectionsCount'.  
- Questions and answers must be generated in the language specified in the notes.  
- The output must follow this JSON format:  

{
  "quiz": [
    {
      "question": "Question text 1",
      "answers": [
        { "text": "Answer A", "correct": false },
        { "text": "Answer B", "correct": true },
        { "text": "Answer C", "correct": false },
        { "text": "Answer D", "correct": false }
      ]
    }
  ]
}
</prompt_rules>

<context>
Input parameters:  
- files:
${fileArr.map((file, idx) => `File ${idx + 1}:\n${file}`).join('\n\n')}
- sectionsCount: ${sectionsCount}   
</context>
  `,
      },
    ];

    const tokens = await this.countTokens(messages, 'gpt-4o');
    this.logger.log(`Prompt uses ${tokens} tokens`);
    return messages;
  }

  async generateQuiz(
    document: IDoc[],
    // difficulty: string,
    // questionsCount: string,
    // title: string,
    // description: string,
  ) {
    const batchSize = 5;
    const quizArr = [];

    for (let i = 0; i < document.length; i += batchSize) {
      const batch = document.slice(i, i + batchSize);
      const bachPromises = batch.map(async (doc) => {
        const message: ChatCompletionMessageParam[] = [
          { role: 'system', content: systemPrompt() },
          {
            role: 'user',
            content: `Create quiz based on following data: \n\n ${doc.text}`,
          },
        ];

        // const completion = (await this.completion(
        //   messages,
        //   model: 'gpt-4o',
        //   stream: false,
        // )) as ChatCompletion;
      });
    }
  }
}
