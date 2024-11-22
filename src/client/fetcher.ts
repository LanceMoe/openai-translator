import OpenAIClient from '@/client';
import { CHAT_MODELS, type ChatModel, type OpenAIModel } from '@/constants';
import { trimText } from '@/utils';

export const fetchTranslation = async (params: {
  token: string;
  engine: OpenAIModel;
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

  const isChatModel = (CHAT_MODELS as string[]).includes(engine);

  const tmpParam = +temperatureParam > 0.4 && +temperatureParam <= 1.0 ? +temperatureParam : getRadomNumber(0.5, 1.0);

  if (isChatModel) {
    const resp = await OpenAIClient.chatCompletions(token, prompt, queryText, engine as ChatModel, tmpParam);
    const text = resp.data.choices
      .map((choice) => choice.message?.content.trim() || '')
      .join('\n')
      .trim();
    return trimText(text);
  }

  const resp = await OpenAIClient.completions(token, prompt, queryText, engine, tmpParam);
  const text = resp.data.choices
    .map((choice) => choice.text.trim())
    .join('\n')
    .trim();
  return trimText(text);
};
