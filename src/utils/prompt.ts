import { Language, LANGUAGES } from '@/constants';

export const getTranslatePrompt = (fromLang: Language, toLang: Language) => {
  if (fromLang === 'wyw' || fromLang === 'zh-Hans' || fromLang === 'zh-Hant') {
    if (toLang === 'zh-Hant') {
      return '翻譯成繁體白話文，使用台灣用語';
    } else if (toLang === 'zh-Hans') {
      return '翻译成简体白话文';
    } else if (toLang === 'yue') {
      return '翻譯成粵語白話文';
    }
  }
  if (toLang === 'wyw' || toLang === 'yue') {
    return `翻譯成${LANGUAGES[toLang] || toLang}`;
  }
  if (fromLang === 'auto') {
    if (toLang === 'zh-Hant') {
      return '翻譯為繁體中文，使用台灣用語';
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
    if (toLang === 'zh-Hans') {
      return '润色此句';
    } else if (toLang === 'zh-Hant') {
      return '把這段文字潤飾一下，使用台灣用語';
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
