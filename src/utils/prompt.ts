import { Language, LANGUAGES } from '@/constants';

export const getTranslatePrompt = (fromLang: Language, toLang: Language) => {
  if (fromLang === 'wyw' || fromLang === 'zh-Hans' || fromLang === 'zh-Hant') {
    if (toLang === 'zh-Hant') {
      return '翻译成繁体白话文';
    } else if (toLang === 'zh-Hans') {
      return '翻译成简体白话文';
    } else if (toLang === 'yue') {
      return '翻译成粤语白话文';
    }
  }
  if (toLang === 'wyw' || toLang === 'yue') {
    return `翻译成${LANGUAGES[toLang] || toLang}`;
  }
  if (fromLang === 'auto') {
    if (toLang === 'zh-Hant') {
      return '翻譯為繁體';
    }
    if (toLang === 'zh-Hans') {
      return '翻译成简体';
    }
    if (toLang === 'ja') {
      return 'Translate into Japanese.';
    }
    return `translate into ${LANGUAGES[toLang] || toLang}`;
  }
  if (fromLang === toLang) {
    if (toLang === 'zh-Hant' || toLang === 'zh-Hans') {
      return '润色此句';
    } else if (toLang === 'ja') {
      return 'この文を磨く';
    } else if (toLang === 'ko') {
      return '이 문장을 예쁘게 만들어주세요';
    } else {
      return 'polish this sentence';
    }
  }
  return `translate from ${LANGUAGES[fromLang] || fromLang} to ${LANGUAGES[toLang] || toLang}`;
};
