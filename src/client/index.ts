import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';

import apis from '@/client/apis';
import { ChatCompletionsResponse, CompletionsResponse, GPTModel, OpenAIModel } from '@/types';

const { baseUrl, endpoints } = apis;

const client = axios.create({ baseURL: baseUrl });

async function autoSwitchToAlterBaseUrl() {
  const response = await client.post<Record<string, string>>('').catch((error: Error | AxiosError) => {
    if (isAxiosError(error) && error.response) {
      // Root path is accessible, use default base url
      return { status: error.response.status };
    }
    return { status: 500 };
  });
  if (response.status === 404) {
    // Root path is accessible, use default base url
    return false;
  }

  // Root path is not accessible, use alter base url
  client.defaults.baseURL = apis.alterBaseUrl;
  return true;
}

// Auto switch to alter base url
autoSwitchToAlterBaseUrl().then((isSwitched) => {
  if (isSwitched) {
    console.warn('Can not access OpenAI API Url, switched to alter base url!');
  }
  console.log('OpenAI API Url:', client.defaults.baseURL);
});

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
export default {
  useAxios,
  completions,
  chatCompletions,
};
