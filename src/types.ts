export type OpenAIModel = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo' | 'text-davinci-003' | 'text-davinci-002';
export type GPTModel = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo';

export type CompletionsResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: number | null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ChatCompletionsResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
};

export type HistoryRecord = {
  id: string;
  text: string;
  translation: string;
  createdAt: number;
  fromLanguage: string;
  toLanguage: string;
};

export type LastTranslateData = {
  fromLang: string;
  toLang: string;
};

export type ConfigValues = {
  tempretureParam: number;
};
