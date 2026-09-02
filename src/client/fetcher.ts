import OpenAIClient from '@/client';
import type { ChatModel } from '@/constants';
import { trimText } from '@/utils';

const MAX_RETRIES = 5;

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

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await OpenAIClient.chatCompletions(token, prompt, queryText, engine, tmpParam);
      const text = resp.data.choices
        .map((choice) => choice.message?.content.trim() || '')
        .join('\n')
        .trim();
      return trimText(text);
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      // Do not retry on 401 Unauthorized or 403 Forbidden
      if (status === 401 || status === 403) {
        throw err;
      }
      if (attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(1.5, attempt), 5000);
        console.warn(
          `Translation request failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay}ms...`,
          err,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};
