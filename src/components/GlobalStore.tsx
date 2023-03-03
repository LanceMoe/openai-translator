import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { OpenAIModel } from '@/types';

const GlobalContext = createContext<{
  openaiApiKey: string;
  setOpenAiApiKey: Dispatch<SetStateAction<string>>;
  currentModel: OpenAIModel;
  setCurrentModel: Dispatch<SetStateAction<OpenAIModel>>;
}>({
  openaiApiKey: '',
  setOpenAiApiKey: () => {},
  currentModel: 'gpt-3.5-turbo',
  setCurrentModel: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider = (props: Props) => {
  const { children } = props;

  const [openaiApiKey, setOpenAiApiKey] = useLocalStorage('openai-api-key', '');
  const [currentModel, setCurrentModel] = useLocalStorage<OpenAIModel>('current-model', 'gpt-3.5-turbo');

  const contextValue = useMemo(
    () => ({
      openaiApiKey,
      setOpenAiApiKey,
      currentModel,
      setCurrentModel,
    }),
    [openaiApiKey, setOpenAiApiKey, currentModel, setCurrentModel],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalStore = () => {
  return useContext(GlobalContext);
};
