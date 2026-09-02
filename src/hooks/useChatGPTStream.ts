import { useCallback, useState } from 'react';

import OpenAIClient from '@/client';
import type { ChatModel } from '@/constants';

export function useChatGPTStream() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(
    (params: { token: string; engine: ChatModel; prompt: string; temperatureParam: number; queryText: string }) => {
      const { token, engine, prompt, queryText, temperatureParam } = params;
      if (loading) {
        console.warn('Already loading!');
        return;
      }
      setData('');
      setLoading(true);
      if (!token) {
        setError('No API Key found!');
        setLoading(false);
        return;
      }
      if (!prompt) {
        setError('No prompt found!');
        setLoading(false);
        return;
      }

      const tmpParam =
        Number.isFinite(+temperatureParam) && +temperatureParam >= 0 && +temperatureParam <= 2
          ? +temperatureParam
          : 0.7;

      OpenAIClient.chatCompletionsStream(
        {
          token,
          prompt,
          query: queryText,
          model: engine,
          temperature: tmpParam,
        },
        {
          async onopen(res) {
            setData('');
            setLoading(true);
            if (res.ok && res.status === 200) {
              console.log('Connection made ', res.status);
              setError('');
            } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
              console.warn('Client side error ', res);
              setError('Client side error ' + res.status);
              setLoading(false);
            } else if (!res.ok) {
              setError('HTTP error ' + res.status);
              setLoading(false);
            }
          },
          onmessage(event) {
            if (event.data === '[DONE]') {
              setError('');
              setLoading(false);
              return;
            }
            try {
              const parsedData = JSON.parse(event.data) as ChatCompletionsResponse;
              const text = parsedData.choices?.map((choice) => choice.delta?.content || '').join('') || '';
              setData((prev) => prev + text);
            } catch (err) {
              console.warn('Failed to parse SSE event data', err);
            }
          },
          onclose() {
            setError('');
            setLoading(false);
          },
          onerror(err) {
            setError(err);
            setLoading(false);
          },
        },
      ).catch((err) => {
        setError(err);
        setLoading(false);
      });
    },
    [loading],
  );
  return { data, mutate, isError: !!error, isLoading: loading };
}
