interface Window {
  BUILD_TIME: string;
}

declare const BUILD_TIME: string;

type ChatCompletionsResponse = {
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
    delta?: {
      content: string;
    };
    message?: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
};

type HistoryRecord = {
  id: string;
  text: string;
  translation: string;
  createdAt: number;
  fromLanguage: string;
  toLanguage: string;
};

type LastTranslateData = {
  fromLang: string;
  toLang: string;
};
