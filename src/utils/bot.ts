import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export async function generateText(data: string, type: 'title' | 'content') {
  // For text-only input, use the gemini-pro model

  const genAI = new GoogleGenerativeAI(config.get('GOOGLE_GEMINI_API_KEY'));
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 4000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  // const history =
  //   type === 'title'
  //     ? []
  //     : [
  //         {
  //           role: 'user',
  //           parts: [{ text: 'hi' }],
  //         },
  //         {
  //           role: 'model',
  //           parts: [{ text: 'Hello, how can I assist you today?' }],
  //         },
  //         {
  //           role: 'user',
  //           parts: [
  //             {
  //               text: `You are a professional blog writer.Write a blog post based on the following article (provide the article here).\nExtract key takeaways and explain them in a clear, concise way.\nOffer real-world examples or illustrations to enhance understanding.`,
  //             },
  //           ],
  //         },
  //       ];

  const parts =
    type === 'title'
      ? [
          {
            text: `write title with the same context and length should not be more than 20 words - ${data}`,
          },
        ]
      : [
          {
            text: `You are a professional blog writer.Write a blog post based on the following article. Extract key points make suitable headings and explain them in a clear, concise way. it should be 2000 words. Article - ${data}`,
          },
        ];

  const chat = model.generateContent({
    generationConfig,
    safetySettings,
    contents: [{ role: 'user', parts }],
  });

  // let msg: string;

  // if (type === 'title') {
  //   msg = `write title with the same context and length should not be more than 20 words - ${data}`;
  // } else {
  //   msg = `Article - ${data}`;
  // }

  const result = await chat;
  const response = result.response;
  return response.text();
}
