import { fetchEventSource, FetchEventSourceInit } from '@microsoft/fetch-event-source';
import axios from 'axios';

import apis from '@/client/apis';
import { DEFAULT_MODEL } from '@/constants';

const { baseUrl } = apis;

export function normalizeApiBaseUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();
  if (!url) {
    url = baseUrl || 'https://api.openai.com/v1';
  }

  // Prepend protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    const isLocal = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(url);
    url = `${isLocal ? 'http://' : 'https://'}${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip trailing /chat/completions if the user entered the full endpoint
  url = url.replace(/\/chat\/completions\/?$/i, '');
  url = url.replace(/\/+$/, '');

  // If the URL does not already end with /v1, automatically append /v1
  if (!/\/v1$/i.test(url)) {
    url = `${url}/v1`;
  }

  return url;
}

let apiBaseUrl = normalizeApiBaseUrl(baseUrl);
const client = axios.create();

export function setApiBaseUrl(url: string) {
  apiBaseUrl = normalizeApiBaseUrl(url);
}

export function getChatCompletionsUrl(customBaseUrl?: string): string {
  const base = normalizeApiBaseUrl(customBaseUrl || apiBaseUrl);
  return `${base}/chat/completions`;
}

export async function chatCompletions(
  token: string,
  prompt: string,
  query: string,
  model = DEFAULT_MODEL,
  temperature = 0.2,
  maxTokens = 2000,
  topP = 1,
  frequencyPenalty = 0,
  presencePenalty = 0,
) {
  const targetUrl = getChatCompletionsUrl();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: query },
    ],
  };

  const response = await client.post<ChatCompletionsResponse>(targetUrl, body, config);
  return response;
}

export async function chatCompletionsStream(
  params: {
    token: string;
    prompt: string;
    query: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  },
  options: FetchEventSourceInit,
) {
  const {
    token,
    prompt,
    query,
    model = DEFAULT_MODEL,
    temperature = 0.2,
    maxTokens = 2000,
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0,
  } = params;
  const targetUrl = getChatCompletionsUrl();

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    stream: true,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: query },
    ],
  };
  const response = await fetchEventSource(targetUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    openWhenHidden: true,
    ...options,
  });
  return response;
}

export default {
  setApiBaseUrl,
  getChatCompletionsUrl,
  chatCompletions,
  chatCompletionsStream,
};
