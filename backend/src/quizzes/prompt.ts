import { ChatCompletionMessageParam } from 'openai/resources/index.js';

const prompt: ChatCompletionMessageParam = {
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
- files: array of files containing the source content for questions and answers  
- sectionsCount: number of quiz sections to generate  
- notes: additional metadata, including the target language for questions and answers  
</context>
  `,
};
