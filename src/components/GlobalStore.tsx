import { useMutation } from '@tanstack/react-query';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { fetchTranslation } from '@/client/fetcher';
import { ConfigValues, HistoryRecord, LastTranslateData, OpenAIModel } from '@/types';

type GlobalContextValue = {
  openaiApiKey: string;
  setOpenAiApiKey: Dispatch<SetStateAction<string>>;
  currentModel: OpenAIModel;
  setCurrentModel: Dispatch<SetStateAction<OpenAIModel>>;
  extraConfig: ConfigValues;
  setExtraConfig: Dispatch<SetStateAction<ConfigValues>>;
  translator: {
    lastTranslateData: LastTranslateData;
    setLastTranslateData: Dispatch<SetStateAction<LastTranslateData>>;
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTanslateText: (data: Parameters<typeof fetchTranslation>[0]) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
  history: {
    historyRecords: HistoryRecord[];
    setHistoryRecords: Dispatch<SetStateAction<HistoryRecord[]>>;
  };
};

const GlobalContext = createContext<GlobalContextValue>({
  openaiApiKey: '',
  setOpenAiApiKey: () => {},
  currentModel: 'gpt-3.5-turbo',
  setCurrentModel: () => {},
  extraConfig: {
    tempretureParam: 1,
  },
  setExtraConfig: () => {},
  translator: {
    lastTranslateData: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    setLastTranslateData: () => {},
    translateText: '',
    setTranslateText: () => {},
    translatedText: undefined,
    mutateTanslateText: () => {},
    isTranslating: false,
    isTranslateError: false,
  },
  history: {
    historyRecords: [],
    setHistoryRecords: () => {},
  },
});

type Props = {
  children: React.ReactNode;
};

export function GlobalProvider(props: Props) {
  const { children } = props;

  const [openaiApiKey, setOpenAiApiKey] = useLocalStorage<string>('openai-api-key', '');
  const [currentModel, setCurrentModel] = useLocalStorage<OpenAIModel>('current-model', 'gpt-3.5-turbo');
  const [translateText, setTranslateText] = useState('');
  const [historyRecords, setHistoryRecords] = useLocalStorage<HistoryRecord[]>('history-record', []);
  const [lastTranslateData, setLastTranslateData] = useLocalStorage<LastTranslateData>('last-translate-data', {
    fromLang: 'auto',
    toLang: 'auto',
  });
  const [extraConfig, setExtraConfig] = useLocalStorage<ConfigValues>('extra-config', {
    tempretureParam: 1,
  });

  const {
    data: translatedText,
    mutate: mutateTanslateText,
    isLoading: isTranslating,
    isError: isTranslateError,
  } = useMutation(fetchTranslation);

  useEffect(() => {
    if (!translatedText) {
      return;
    }
    setHistoryRecords((prev) => [
      {
        id: self.crypto.randomUUID(),
        fromLanguage: lastTranslateData.fromLang,
        toLanguage: lastTranslateData.toLang,
        text: translateText,
        translation: translatedText,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, [translatedText]);

  const contextValue = useMemo(
    () => ({
      openaiApiKey,
      setOpenAiApiKey,
      currentModel,
      setCurrentModel,
      extraConfig,
      setExtraConfig,
      translator: {
        lastTranslateData,
        setLastTranslateData,
        translateText,
        setTranslateText,
        translatedText,
        mutateTanslateText,
        isTranslating,
        isTranslateError,
      },
      history: {
        historyRecords,
        setHistoryRecords,
      },
    }),
    [
      openaiApiKey,
      setOpenAiApiKey,
      currentModel,
      setCurrentModel,
      translateText,
      setTranslateText,
      translatedText,
      mutateTanslateText,
      isTranslating,
      isTranslateError,
      historyRecords,
      setHistoryRecords,
      extraConfig,
      setExtraConfig,
    ],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

export function useGlobalStore() {
  return useContext(GlobalContext);
}
