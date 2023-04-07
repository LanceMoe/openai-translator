import clsx from 'clsx';
import { useEffect } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import TextareaAutosize from 'react-textarea-autosize';

import { useGlobalStore } from '@/components/GlobalStore';
import { Language, LANGUAGES } from '@/constants';
import { getTranslatePrompt } from '@/utils/prompt';

function TranslatorPage() {
  const { t, i18n } = useTranslation();

  const {
    configValues: { openaiApiKey, currentModel, tempretureParam },
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
  } = useGlobalStore();

  useEffect(() => {
    if (!isTranslateError) {
      return;
    }
    toast.error(t('Something went wrong, please try again later.'));
  }, [isTranslateError]);

  // ↑ Hooks before, keep hooks order

  const onExchangeLanguageBtnClick = () =>
    setLastTranslateData((prev) => ({
      ...prev,
      fromLang: lastTranslateData.toLang,
      toLang: lastTranslateData.fromLang,
    }));

  const handleTranslate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!openaiApiKey) {
      toast.error(t('Please enter your API Key in config page first!'));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const { translateText, fromLang, toLang } = Object.fromEntries(formData.entries());
    if (!translateText || !fromLang || !toLang) {
      return;
    }

    setTranslateText(translateText as string);

    let prompt: string;

    if (toLang === 'auto') {
      if (i18n.language.startsWith('zh')) {
        prompt = '翻译成简体白话文';
      } else {
        const _toLang = LANGUAGES[i18n.language as Language] || i18n.language;
        prompt = `translate into ${_toLang}`;
      }
    } else {
      prompt = getTranslatePrompt(fromLang as Language, toLang as Language);
    }

    setLastTranslateData((prev) => ({
      ...prev,
      fromLang: fromLang as Language,
      toLang: toLang as Language,
    }));

    mutateTanslateText({
      token: openaiApiKey,
      engine: currentModel,
      prompt: prompt,
      tempretureParam: tempretureParam,
      queryText: translateText as string,
    });
  };

  return (
    <form method="post" onSubmit={handleTranslate}>
      <div className="container max-w-screen-2xl xl:mx-auto md:grid md:grid-cols-2 md:gap-4">
        <div className="w-full md:min-h-[calc(100vh_-_112px)] max-w-full p-4 m-0 shadow-md top-16 bg-base-100">
          <div className="flex flex-row mb-4">
            <select
              className="w-5/12 select"
              value={lastTranslateData.fromLang}
              onChange={(e) => setLastTranslateData((prev) => ({ ...prev, fromLang: e.target.value }))}
              name="fromLang"
              title="From Language"
              required
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>

            <div className="flex justify-center w-2/12">
              <Button type="button" color="ghost" shape="circle" onClick={onExchangeLanguageBtnClick} title="Exchange">
                <CgArrowsExchange size={20} />
              </Button>
            </div>

            <select
              className="w-5/12 select"
              value={lastTranslateData.toLang}
              onChange={(e) => setLastTranslateData((prev) => ({ ...prev, toLang: e.target.value }))}
              name="toLang"
              title="To language"
              required
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <TextareaAutosize
              name="translateText"
              defaultValue={translateText}
              className="w-full mb-2 break-all resize-none rounded-2xl textarea textarea-md textarea-primary md:min-h-[120px]"
              placeholder={t('Please enter the text you want to translate here.')}
              required
            ></TextareaAutosize>

            <Button
              type="submit"
              color="primary"
              className="md:hidden"
              loading={isTranslating}
              disabled={isTranslating}
            >
              {isTranslating ? t('Translating...') : t('Translate')}
            </Button>
          </div>
        </div>
        <div className="p-4 pb-14 m-0 form-control">
          <Button
            type="submit"
            color="primary"
            className="hidden mb-4 md:inline-flex"
            loading={isTranslating}
            disabled={isTranslating}
          >
            {isTranslating ? t('Translating...') : t('Translate')}
          </Button>
          <TextareaAutosize
            name="translatedText"
            value={translatedText || ''}
            className="w-full mb-2 break-all resize-none rounded-2xl textarea textarea-md textarea-ghost md:min-h-[120px]"
            placeholder={isTranslating ? t('Please wait...') : t('Translated text will appear here.')}
            readOnly
            required
          ></TextareaAutosize>
        </div>
      </div>
    </form>
  );
}

export default TranslatorPage;
