/* eslint-disable camelcase */

import { getKeys } from '@/utils';

export const CHAT_MODELS_TITLES = {
  // Chat models
  'gpt-4o-mini': 'GPT-4o-Mini (recommended)',
  'gpt-4o': 'GPT-4o',
  'gpt-4-turbo': 'GPT-4-Turbo',
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5-Turbo',
  'gpt-4o-mini-2024-07-18': 'GPT-4o-Mini (2024-07-18)',
  'gpt-4o-2024-08-06': 'GPT-4o (2024-08-06)',
  'gpt-4o-2024-05-13': 'GPT-4o (2024-05-13)',
  'gpt-4-turbo-preview': 'GPT-4-Turbo Preview',
  'gpt-4-turbo-2024-04-09': 'GPT-4-Turbo (2024-04-09)',
  'gpt-4-1106-preview': 'GPT-4 (1106 Preview)',
  'gpt-4-0613': 'GPT-4 (0613)',
  'gpt-4-0125-preview': 'GPT-4 (0125 Preview)',
  'gpt-3.5-turbo-16k': 'GPT-3.5-Turbo (16k)',
  'gpt-3.5-turbo-1106': 'GPT-3.5-Turbo (1106)',
  'gpt-3.5-turbo-0125': 'GPT-3.5-Turbo (0125)',
  'chatgpt-4o-latest': 'ChatGPT-4o Latest',
  // Reasoning models
  'o1-mini': 'o1-Mini',
  'o1-preview': 'o1-Preview',
  'o1-mini-2024-09-12': 'o1o1-Mini (2024-09-12)',
  'o1-preview-2024-09-12': 'o1 Preview (2024-09-12)',
} as const;

const COMPLETIONS_MODELS_TITLES = {
  // Completions models
  'gpt-3.5-turbo-instruct': 'GPT-3.5-Turbo Instruct',
  'gpt-3.5-turbo-instruct-0914': 'GPT-3.5-Turbo Instruct (0914)',
  'babbage-002': 'Babbage-002',
  'text-davinci-002': 'Text-Davinci-002',
} as const;

export const OPENAI_MODELS_TITLES = {
  ...CHAT_MODELS_TITLES,
  ...COMPLETIONS_MODELS_TITLES,
} as const;

export type ChatModel = keyof typeof CHAT_MODELS_TITLES;
export type CompletionsModel = keyof typeof COMPLETIONS_MODELS_TITLES;
export type OpenAIModel = keyof typeof OPENAI_MODELS_TITLES;

export const CHAT_MODELS = getKeys(CHAT_MODELS_TITLES);
export const COMPLETIONS_MODELS = getKeys(COMPLETIONS_MODELS_TITLES);
export const OPENAI_MODELS = getKeys(OPENAI_MODELS_TITLES);

export const LANGUAGES = {
  auto: 'Auto',
  'zh-Hans': '简体中文',
  'zh-Hant': '正體中文',
  en: 'English',
  yue: '粵語',
  wyw: '漢文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ar: 'العربية',
  af: 'Afrikaans',
  am: 'Amharic',
  az: 'Azerbaijani',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bn: 'Bengali',
  bs: 'Bosnian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  co: 'Corsican',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  el: 'Greek',
  eo: 'Esperanto',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  fi: 'Finnish',
  fj: 'Fijian',
  fy: 'Frisian',
  ga: 'Irish',
  gd: 'Scots Gaelic',
  gl: 'Galician',
  gu: 'Gujarati',
  ha: 'Hausa',
  haw: 'Hawaiian',
  he: 'Hebrew',
  hi: 'Hindi',
  hmn: 'Hmong',
  hr: 'Croatian',
  ht: 'Haitian Creole',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Indonesian',
  ig: 'Igbo',
  is: 'Icelandic',
  jw: 'Javanese',
  ka: 'Georgian',
  kk: 'Kazakh',
  km: 'Khmer',
  kn: 'Kannada',
  ku: 'Kurdish',
  ky: 'Kyrgyz',
  la: 'Latin',
  lb: 'Luxembourgish',
  lo: 'Lao',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mg: 'Malagasy',
  mi: 'Maori',
  mk: 'Macedonian',
  ml: 'Malayalam',
  mn: 'Mongolian',
  mr: 'Marathi',
  ms: 'Malay',
  mt: 'Maltese',
  my: 'Burmese',
  ne: 'Nepali',
  no: 'Norwegian',
  ny: 'Chichewa',
  or: 'Odia',
  pa: 'Punjabi',
  ps: 'Pashto',
  ro: 'Romanian',
  rw: 'Kinyarwanda',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  sm: 'Samoan',
  sn: 'Shona',
  so: 'Somali',
  sq: 'Albanian',
  sr: 'Serbian',
  'sr-Cyrl': 'Serbian Cyrillic',
  'sr-Latn': 'Serbian Latin',
  st: 'Sesotho',
  su: 'Sundanese',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  tg: 'Tajik',
  th: 'Thai',
  tk: 'Turkmen',
  tl: 'Tagalog',
  tr: 'Turkish',
  tt: 'Tatar',
  ug: 'Uyghur',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu',
} as const;

export type Language = keyof typeof LANGUAGES;

export type ConfigValues = {
  openaiApiUrl: string;
  openaiApiKey: string;
  streamEnabled: boolean;
  currentModel: OpenAIModel;
  temperatureParam: number;
};
