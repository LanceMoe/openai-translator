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
      setError('');
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

      const MAX_RETRIES = 5;
      let retryCount = 0;
      let isFatal = false;
      let accumulatedText = '';

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
            if (res.ok && res.status === 200) {
              console.log('Stream connection established (200 OK)');
              setError('');
              accumulatedText = '';
              setData('');
              setLoading(true);
            } else if (res.status === 401 || res.status === 403) {
              // Non-retryable authentication error
              isFatal = true;
              setError(`Authentication failed (${res.status}). Please check your API Key.`);
              setLoading(false);
              throw new Error(`Fatal auth error ${res.status}`);
            } else {
              // Retryable HTTP error (e.g. 429, 500, 502, 503, 504)
              console.warn(`Stream received HTTP ${res.status}, will retry...`);
              throw new Error(`HTTP error ${res.status}`);
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
              accumulatedText += text;
              setData(accumulatedText);
            } catch (err) {
              console.warn('Failed to parse SSE event data', err);
            }
          },
          onclose() {
            setLoading(false);
          },
          onerror(err) {
            if (isFatal) {
              throw err;
            }
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              const delay = Math.min(1000 * Math.pow(1.5, retryCount - 1), 5000);
              console.warn(`Stream error (retry ${retryCount}/${MAX_RETRIES}). Retrying in ${delay}ms...`, err);
              return delay;
            } else {
              console.error(`Stream failed after ${MAX_RETRIES} retries.`, err);
              setError(String(err?.message || err || 'Stream connection failed.'));
              setLoading(false);
              throw err;
            }
          },
        },
      ).catch((err) => {
        if (!isFatal) {
          setError(String(err?.message || err || 'Request failed.'));
          setLoading(false);
        }
      });
    },
    [loading],
  );
  return { data, mutate, isError: !!error, isLoading: loading };
}
