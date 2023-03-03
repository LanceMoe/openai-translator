import OpenAIClient from '@/client';
import { GPT_MODELS } from '@/constants';
import { GPTModel, OpenAIModel } from '@/types';
import { trimText } from '@/utils';

export const fetchTranslation = async (params: {
  token: string;
  engine: OpenAIModel;
  prompt: string;
  queryText: string;
}) => {
  const { token, engine, prompt, queryText } = params;
  if (!token) {
    throw new Error('No API Key found!');
  }
  if (!prompt) {
    throw new Error('No prompt found!');
  }

  const isGptModel = (GPT_MODELS as unknown as string[]).includes(engine);

  if (isGptModel) {
    const resp = await OpenAIClient.chatCompletions(token, prompt, queryText, engine as GPTModel);
    const text = resp.data.choices
      .map((choice) => choice.message.content.trim())
      .join('\n')
      .trim();
    return trimText(text);
  }

  const resp = await OpenAIClient.completions(token, prompt, queryText, engine);
  const text = resp.data.choices
    .map((choice) => choice.text.trim())
    .join('\n')
    .trim();
  return trimText(text);
};
