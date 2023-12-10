import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTranslation } from '@/client/fetcher';

import { useChatGPTStream } from './useChatGPTStream';

export function useQueryApi(streamEnabled = true) {
  const { data, mutate, isPending, isError } = useMutation({ mutationFn: fetchTranslation });
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
        : { data, mutate, isLoading: isPending, isError },
    [data, isError, isPending, mutate, streamData, streamEnabled, streamIsError, streamIsLoading, streamMutate],
  );

  return value;
}
