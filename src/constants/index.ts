export const CHAT_MODELS = [
  // --- High Cost-Efficiency & Speed (Daily & Bulk Translation) ---
  'gpt-4o-mini', // [In: $0.15 / Out: $0.60 per 1M] Ultra low-cost, fast, ideal for bulk translation
  'gpt-5.4-mini', // [In: $1.50 / Out: $9.00 per 1M] Fast, better format retention and long text handling
  'gpt-5.4-nano', // [In: $0.20 / Out: $0.80 per 1M] Lowest cost, suitable for short phrases and queries

  // --- Flagship Models (High Accuracy & Professional Domains) ---
  'gpt-4o', // [In: $2.50 / Out: $10.00 per 1M] Strong multilingual support and context accuracy
  'gpt-4.5-preview', // [In: $75.00 / Out: $150.00 per 1M] Exceptional phrasing, literary and nuanced text
  'gpt-5.6-sol', // [In: $5.00 / Out: $30.00 per 1M] Top flagship for legal, medical, and specialized docs
  'gpt-5.6-terra', // [In: $2.00 / Out: $12.00 per 1M] Balanced flagship for quality and cost
  'gpt-5.6-luna', // [In: $0.20 / Out: $2.40 per 1M] High performance with low latency
  'gpt-5.5', // [In: $12.50 / Out: $75.00 per 1M] Professional long-form document translation

  // --- Reasoning Models (Complex Ambiguity & Ancient Text) ---
  'o3-mini', // [In: $1.10 / Out: $4.40 per 1M] Handles complex logic and ambiguous idioms
  'o1', // [In: $15.00 / Out: $60.00 per 1M] Deep reasoning for ancient texts and concept alignment

  // --- Open-Weight Models (Self-Hosted Translation) ---
  'gpt-oss-120b', // [Free open-weight] Flagship model for private enterprise hosting
  'gpt-oss-20b', // [Free open-weight] Lightweight model for low-latency private hosting
] as const;

export const DEFAULT_MODEL = 'gpt-5.6-luna';

export type ChatModel = string;

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
  currentModel: ChatModel;
  temperatureParam: number;
};
