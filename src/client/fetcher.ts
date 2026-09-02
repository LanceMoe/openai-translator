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

  const tmpParam =
    Number.isFinite(+temperatureParam) && +temperatureParam >= 0 && +temperatureParam <= 2 ? +temperatureParam : 0.7;

  const resp = await OpenAIClient.chatCompletions(token, prompt, queryText, engine, tmpParam);
  const text = resp.data.choices
    .map((choice) => choice.message?.content.trim() || '')
    .join('\n')
    .trim();
  return trimText(text);
};
