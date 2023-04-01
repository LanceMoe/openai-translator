import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTranslation } from '@/client/fetcher';

import { useChatGPTStream } from './useChatGPTStream';

export function useQueryApi(streamEnabled = true) {
  const { data, mutate, isLoading, isError } = useMutation(fetchTranslation);
  const {
    data: streamData,
    mutate: streamMutate,
    isLoading: streamIsLoading,
    isError: streamIsError,
  } = useChatGPTStream();

  const value = useMemo(
    () =>
      streamEnabled
        ? { data: streamData, mutate: streamMutate, isLoading: streamIsLoading, isError: streamIsError }
        : { data, mutate, isLoading, isError },
    streamEnabled
      ? [streamEnabled, streamData, streamMutate, streamIsLoading, streamIsError]
      : [streamEnabled, data, mutate, isLoading, isError],
  );

  return value;
}
