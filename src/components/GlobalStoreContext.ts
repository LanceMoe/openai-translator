import { createContext, Dispatch, SetStateAction } from 'react';

import { fetchTranslation } from '@/client/fetcher';
import { type ConfigValues, DEFAULT_MODEL } from '@/constants';

export type GlobalContextValue = {
  configValues: ConfigValues;
  setConfigValues: Dispatch<SetStateAction<ConfigValues>>;
  translator: {
    lastTranslateData: LastTranslateData;
    setLastTranslateData: Dispatch<SetStateAction<LastTranslateData>>;
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTranslateText: (data: Parameters<typeof fetchTranslation>[0]) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
  history: {
    historyRecords: HistoryRecord[];
    setHistoryRecords: Dispatch<SetStateAction<HistoryRecord[]>>;
  };
};

export const GlobalContext = createContext<GlobalContextValue>({
  configValues: {
    openaiApiUrl: 'https://api.openai.com',
    openaiApiKey: '',
    streamEnabled: true,
    currentModel: DEFAULT_MODEL,
    temperatureParam: 0.7,
  },
  setConfigValues: () => undefined,
  translator: {
    lastTranslateData: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    setLastTranslateData: () => undefined,
    translateText: '',
    setTranslateText: () => undefined,
    translatedText: undefined,
    mutateTranslateText: () => undefined,
    isTranslating: false,
    isTranslateError: false,
  },
  history: {
    historyRecords: [],
    setHistoryRecords: () => undefined,
  },
});
