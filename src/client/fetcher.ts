import OpenAIClient from '@/client';
import type { ChatModel } from '@/constants';
import { trimText } from '@/utils';

export const fetchTranslation = async (params: {
  token: string;
  engine: ChatModel;
  prompt: string;
  temperatureParam: number;
  queryText: string;
}) => {
  const { token, engine, prompt, queryText, temperatureParam } = params;
  if (!token) {
    throw new Error('No API Key found!');
  }
  if (!prompt) {
    throw new Error('No prompt found!');
  }

  const getRadomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const tmpParam = +temperatureParam > 0.4 && +temperatureParam <= 1.0 ? +temperatureParam : getRadomNumber(0.5, 1.0);

  const resp = await OpenAIClient.chatCompletions(token, prompt, queryText, engine, tmpParam);
  const text = resp.data.choices
    .map((choice) => choice.message?.content.trim() || '')
    .join('\n')
    .trim();
  return trimText(text);
};
