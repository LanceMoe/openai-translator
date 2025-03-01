import { fetchEventSource, type FetchEventSourceInit } from '@microsoft/fetch-event-source';
import ky from 'ky';

import apis from '@/client/apis';
import type { ChatModel } from '@/constants';

const { endpoints, baseUrl } = apis;

const client = ky.create({ prefixUrl: baseUrl });
let currentBaseUrl = baseUrl;

export function setApiBaseUrl(url: string) {
  currentBaseUrl = url;
  // Re-create the ky client with the new prefix URL
  client.extend({ prefixUrl: url });
}

export async function completions(
  token: string,
  prompt: string,
  query: string,
  model = 'text-davinci-003',
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const { url, headers } = endpoints.v1.completions;

  const body = {
    prompt: `${prompt}:\n\n"${query}" =>`,
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
  };

  const response = await client
    .post(url, {
      json: body,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    })
    .json<CompletionsResponse>();

  return { data: response };
}

export async function chatCompletions(
  token: string,
  prompt: string,
  query: string,
  model: ChatModel = 'gpt-4o-mini',
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
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
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: `"${query}"` },
    ],
  };

  const response = await client
    .post(url, {
      json: body,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    })
    .json<ChatCompletionsResponse>();

  return { data: response };
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
    model = 'gpt-4o-mini',
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
  const response = await fetchEventSource(currentBaseUrl + url, {
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
  completions,
  chatCompletions,
  chatCompletionsStream,
};
