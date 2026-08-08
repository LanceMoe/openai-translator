import { fetchEventSource, FetchEventSourceInit } from '@microsoft/fetch-event-source';
import axios from 'axios';

import apis from '@/client/apis';
import { DEFAULT_MODEL } from '@/constants';

const { endpoints, baseUrl } = apis;

const client = axios.create({ baseURL: baseUrl });
let apiBaseUrl = baseUrl;

export function setApiBaseUrl(url: string) {
  apiBaseUrl = url.trim().replace(/\/+$/, '') || baseUrl;
  client.defaults.baseURL = apiBaseUrl;
}

export async function chatCompletions(
  token: string,
  prompt: string,
  query: string,
  model = DEFAULT_MODEL,
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const { url, headers } = endpoints.v1.chat.completions;
  const config = {
    headers: {
      ...headers,
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
      { role: 'user', content: `"${query}"` },
    ],
  };

  const response = await client.post<ChatCompletionsResponse>(url, body, config);
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
    temperature = 0,
    maxTokens = 1000,
    topP = 1,
    frequencyPenalty = 1,
    presencePenalty = 1,
  } = params;
  const { url, headers } = endpoints.v1.chat.completions;

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
      { role: 'system', content: 'Please note that your response should solely consist of the translation.' },
      { role: 'user', content: query },
    ],
  };
  const response = await fetchEventSource(apiBaseUrl + url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    openWhenHidden: true,
    ...options,
  });
  return response;
}

export default {
  setApiBaseUrl,
  chatCompletions,
  chatCompletionsStream,
};
