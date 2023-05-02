import { fetchEventSource, FetchEventSourceInit } from '@microsoft/fetch-event-source';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';

import apis from '@/client/apis';
import { ChatCompletionsResponse, CompletionsResponse, GPTModel, OpenAIModel } from '@/types';

let { baseUrl, endpoints } = apis;

const client = axios.create({ baseURL: baseUrl });

export function setApiBaseUrl(url: string) {
  client.defaults.baseURL = url;
  baseUrl = url;
}

export function useAxios(config: AxiosRequestConfig) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await client.request({
          signal: controllerRef.current.signal,
          ...config,
        });

        setData(response.data);
      } catch (error) {
        const { detail } = error as Record<string, string>;
        setError(detail);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return { data, error, loaded, cancel };
}

export async function completions(
  token: string,
  prompt: string,
  query: string,
  model: Omit<OpenAIModel, GPTModel> = 'text-davinci-003',
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const { url, headers } = endpoints.v1.completions;
  const config = {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

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

  const response = await client.post<CompletionsResponse>(url, body, config);
  return response;
}

export async function chatCompletions(
  token: string,
  prompt: string,
  query: string,
  model: GPTModel = 'gpt-3.5-turbo-0301',
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
    model?: GPTModel;
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
    model = 'gpt-3.5-turbo',
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
      { role: 'user', content: `"${query}"` },
    ],
  };
  const response = await fetchEventSource(baseUrl + url, {
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
  useAxios,
  completions,
  chatCompletions,
  chatCompletionsStream,
};
