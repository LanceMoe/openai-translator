import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';

import { fetchTranslation } from '@/client/fetcher';
import { OpenAIModel } from '@/types';

type GlobalContextValue = {
  openaiApiKey: string;
  setOpenAiApiKey: Dispatch<SetStateAction<string>>;
  currentModel: OpenAIModel;
  setCurrentModel: Dispatch<SetStateAction<OpenAIModel>>;
  translator: {
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTanslateText: (data: Parameters<typeof fetchTranslation>[0]) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
};

const GlobalContext = createContext<GlobalContextValue>({
  openaiApiKey: '',
  setOpenAiApiKey: () => {},
  currentModel: 'gpt-3.5-turbo',
  setCurrentModel: () => {},
  translator: {
    translateText: '',
    setTranslateText: () => {},
    translatedText: undefined,
    mutateTanslateText: () => {},
    isTranslating: false,
    isTranslateError: false,
  },
});

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider = (props: Props) => {
  const { children } = props;

  const [openaiApiKey, setOpenAiApiKey] = useLocalStorage('openai-api-key', '');
  const [currentModel, setCurrentModel] = useLocalStorage<OpenAIModel>('current-model', 'gpt-3.5-turbo');
  const [translateText, setTranslateText] = useState('');
  const {
    data: translatedText,
    mutate: mutateTanslateText,
    isLoading: isTranslating,
    isError: isTranslateError,
  } = useMutation('translator', fetchTranslation);

  const contextValue = useMemo(
    () => ({
      openaiApiKey,
      setOpenAiApiKey,
      currentModel,
      setCurrentModel,
      translator: {
        translateText,
        setTranslateText,
        translatedText,
        mutateTanslateText,
        isTranslating,
        isTranslateError,
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
    ],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalStore = () => {
  return useContext(GlobalContext);
};
