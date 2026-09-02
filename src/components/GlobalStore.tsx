import { useLocalStorage } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { setApiBaseUrl } from '@/client';
import { fetchTranslation } from '@/client/fetcher';
import { GlobalContext } from '@/components/GlobalStoreContext';
import { type ConfigValues, DEFAULT_MODEL } from '@/constants';
import { useQueryApi } from '@/hooks/useQueryApi';

type Props = {
  children: React.ReactNode;
};

export function GlobalProvider(props: Props) {
  const { children } = props;
  const [translateText, setTranslateText] = useState('');
  const [historyRecords, setHistoryRecords] = useLocalStorage<HistoryRecord[]>({
    key: 'history-record',
    defaultValue: [],
    getInitialValueInEffect: false,
  });
  const [lastTranslateData, setLastTranslateData] = useLocalStorage<LastTranslateData>({
    key: 'last-translate-data',
    defaultValue: {
      fromLang: 'auto',
      toLang: 'auto',
      style: 'general',
    },
    getInitialValueInEffect: false,
  });
  const [configValues, setConfigValues] = useLocalStorage<ConfigValues>({
    key: 'extra-config',
    defaultValue: {
      openaiApiUrl: 'https://api.openai.com',
      openaiApiKey: '',
      streamEnabled: true,
      currentModel: DEFAULT_MODEL,
      temperatureParam: 0.7,
    },
    getInitialValueInEffect: false,
  });
  const {
    openaiApiUrl = 'https://api.openai.com',
    openaiApiKey = '',
    streamEnabled = true,
    currentModel = DEFAULT_MODEL,
    temperatureParam = 0.7,
  } = configValues;

  const {
    data: translatedText,
    mutate: rawMutateTranslateText,
    isLoading: isTranslating,
    isError: isTranslateError,
  } = useQueryApi(streamEnabled);

  const activeTranslationRef = useRef<{
    fromLang: string;
    toLang: string;
    style?: string;
    text: string;
  } | null>(null);

  const mutateTranslateText = useCallback(
    (data: Parameters<typeof fetchTranslation>[0]) => {
      activeTranslationRef.current = {
        fromLang: lastTranslateData.fromLang,
        toLang: lastTranslateData.toLang,
        style: lastTranslateData.style || 'general',
        text: data.queryText,
      };
      rawMutateTranslateText(data);
    },
    [lastTranslateData.fromLang, lastTranslateData.toLang, lastTranslateData.style, rawMutateTranslateText],
  );

  useEffect(() => setApiBaseUrl(configValues.openaiApiUrl), [configValues.openaiApiUrl]);

  useEffect(() => {
    if (!translatedText || isTranslating) {
      return;
    }
    const currentActive = activeTranslationRef.current;
    const fromLanguage = currentActive?.fromLang || lastTranslateData.fromLang;
    const toLanguage = currentActive?.toLang || lastTranslateData.toLang;
    const style = currentActive?.style || lastTranslateData.style || 'general';
    const text = currentActive?.text ?? translateText;

    setHistoryRecords((prev) => [
      {
        id: self.crypto.randomUUID(),
        fromLanguage,
        toLanguage,
        style,
        text,
        translation: translatedText,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, [
    translatedText,
    isTranslating,
    lastTranslateData.fromLang,
    lastTranslateData.toLang,
    lastTranslateData.style,
    setHistoryRecords,
    translateText,
  ]);

  const contextValue = useMemo(
    () => ({
      configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
      setConfigValues,
      translator: {
        lastTranslateData,
        setLastTranslateData,
        translateText,
        setTranslateText,
        translatedText,
        mutateTranslateText,
        isTranslating,
        isTranslateError,
      },
      history: {
        historyRecords,
        setHistoryRecords,
      },
    }),
    [
      openaiApiUrl,
      openaiApiKey,
      streamEnabled,
      currentModel,
      temperatureParam,
      setConfigValues,
      lastTranslateData,
      setLastTranslateData,
      translateText,
      setTranslateText,
      translatedText,
      mutateTranslateText,
      isTranslating,
      isTranslateError,
      historyRecords,
      setHistoryRecords,
    ],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}
