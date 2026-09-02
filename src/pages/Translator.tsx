import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import { MdAutoAwesome, MdClose, MdContentCopy, MdTranslate } from 'react-icons/md';
import TextareaAutoSize from 'react-textarea-autosize';

import { SpeechRecognitionButton } from '@/components/SpeechRecognitionButton';
import { TTSButton } from '@/components/TTSButton';
import { DEFAULT_TRANSLATE_STYLE, Language, LANGUAGES, TRANSLATE_STYLES, TranslateStyle } from '@/constants';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { getTranslatePrompt } from '@/utils/prompt';

function TranslatorPage() {
  const { t, i18n } = useTranslation();
  const translateTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const {
    configValues: { openaiApiKey, currentModel, temperatureParam },
    translator: {
      lastTranslateData,
      setLastTranslateData,
      translateText,
      setTranslateText,
      translatedText,
      mutateTranslateText,
      isTranslating,
      isTranslateError,
    },
  } = useGlobalStore();

  useEffect(() => {
    if (!isTranslateError) {
      return;
    }
    toast.error(t('Something went wrong, please try again later.'));
  }, [isTranslateError, t]);

  const onCopyBtnClick = useCallback(() => {
    if (!translatedText) {
      toast.error(t('Nothing to copy!'));
      return;
    }
    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        toast.success(t('Copied!'));
      })
      .catch(() => {
        toast.error(t('Failed to copy!'));
      });
  }, [t, translatedText]);

  const onExchangeLanguageBtnClick = useCallback(
    () =>
      setLastTranslateData((prev) => ({
        ...prev,
        fromLang: prev.toLang,
        toLang: prev.fromLang,
      })),
    [setLastTranslateData],
  );

  const onChangeTranscript = useCallback(
    (newTranscript: string) => {
      if (!newTranscript) {
        return;
      }
      setTranslateText(newTranscript);
    },
    [setTranslateText],
  );

  const handleTranslate = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (!openaiApiKey) {
        toast.error(t('Please enter your API Key in config page first!'));
        return;
      }

      const rawText = translateText?.trim();
      if (!rawText) {
        return;
      }

      const fromLang = lastTranslateData.fromLang || 'auto';
      const toLang = lastTranslateData.toLang || 'auto';
      const selectedStyle = (lastTranslateData.style as TranslateStyle) || DEFAULT_TRANSLATE_STYLE;

      let prompt: string;
      if (toLang === 'auto') {
        const targetLang = i18n.language.startsWith('zh') ? 'zh-Hans' : (i18n.language as Language) || 'en';
        prompt = getTranslatePrompt(fromLang as Language, targetLang, selectedStyle);
      } else {
        prompt = getTranslatePrompt(fromLang as Language, toLang as Language, selectedStyle);
      }

      setLastTranslateData((prev) => ({
        ...prev,
        fromLang: fromLang as Language,
        toLang: toLang as Language,
      }));

      mutateTranslateText({
        token: openaiApiKey,
        engine: currentModel,
        prompt,
        temperatureParam,
        queryText: rawText,
      });
    },
    [
      currentModel,
      i18n.language,
      lastTranslateData.fromLang,
      lastTranslateData.style,
      lastTranslateData.toLang,
      mutateTranslateText,
      openaiApiKey,
      setLastTranslateData,
      t,
      temperatureParam,
      translateText,
    ],
  );

  const onClearBtnClick = useCallback(() => {
    if (translateTextAreaRef.current) {
      translateTextAreaRef.current.value = '';
    }
    setTranslateText('');
  }, [setTranslateText]);

  const charCount = translateText ? translateText.length : 0;
  const translatedCharCount = translatedText ? translatedText.length : 0;

  return (
    <form method="post" onSubmit={handleTranslate} className="w-full">
      <div className="container max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Top Control Bar: Languages & Styles */}
        <div className="card bg-base-100/90 border border-base-200/80 shadow-xs backdrop-blur-xs rounded-2xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <select
                className="w-full select select-bordered select-sm md:select-md rounded-xl font-medium focus:select-primary transition-all"
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
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-circle btn-sm md:btn-md shrink-0 hover:btn-primary hover:text-primary-content transition-all duration-300"
              onClick={onExchangeLanguageBtnClick}
              title={t('Exchange')}
            >
              <CgArrowsExchange size={22} />
            </button>

            <div className="flex-1 min-w-0">
              <select
                className="w-full select select-bordered select-sm md:select-md rounded-xl font-medium focus:select-primary transition-all"
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
          </div>

          {/* Style Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-base-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/70">
              <MdAutoAwesome size={15} className="text-primary" />
              <span>{t('Translation Style')}:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {TRANSLATE_STYLES.map((style) => {
                const isActive = (lastTranslateData.style || DEFAULT_TRANSLATE_STYLE) === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setLastTranslateData((prev) => ({ ...prev, style }))}
                    disabled={isTranslating}
                    className={clsx(
                      'badge badge-sm cursor-pointer transition-all duration-200 py-2.5 px-3 rounded-lg text-xs font-medium border',
                      isActive
                        ? 'badge-primary border-primary font-semibold shadow-xs'
                        : 'badge-ghost border-transparent hover:border-base-300 text-base-content/75',
                    )}
                    title={t(`styleDesc_${style}`)}
                  >
                    {t(`style_${style}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Translation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pb-16">
          {/* Source Input Card */}
          <div className="card bg-base-100 border border-base-200/90 shadow-xs hover:border-base-300 transition-all rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between min-h-[280px] md:min-h-[400px]">
            <div className="w-full flex-1">
              <TextareaAutoSize
                ref={translateTextAreaRef}
                name="translateText"
                value={translateText}
                className="w-full border-none focus:outline-hidden p-0 text-base leading-relaxed bg-transparent resize-none min-h-[160px] md:min-h-[280px] placeholder:text-base-content/40"
                placeholder={t('Please enter the text you want to translate here.')}
                onChange={(e) => setTranslateText(e.target.value)}
                disabled={isTranslating}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-base-200/60">
              <div className="flex items-center gap-1.5">
                <SpeechRecognitionButton
                  language={lastTranslateData.fromLang === 'auto' ? i18n.language : lastTranslateData.fromLang}
                  onChangeTranscript={onChangeTranscript}
                  disabled={isTranslating}
                />
                {!!translateText && (
                  <TTSButton
                    language={lastTranslateData.fromLang === 'auto' ? i18n.language : lastTranslateData.fromLang}
                    text={translateText}
                  />
                )}
                {charCount > 0 && (
                  <span className="text-xs text-base-content/40 ml-1 font-mono tabular-nums">
                    {charCount} {charCount === 1 ? 'char' : 'chars'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!!translateText && (
                  <button
                    type="button"
                    className="btn btn-circle btn-sm btn-ghost text-base-content/60 hover:text-base-content"
                    title={t('Clear the input')}
                    onClick={onClearBtnClick}
                  >
                    <MdClose size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-xl px-4 gap-1.5 font-semibold shadow-xs"
                  disabled={isTranslating || !translateText}
                >
                  {isTranslating ? <span className="loading loading-spinner loading-xs" /> : <MdTranslate size={16} />}
                  {isTranslating ? t('Translating...') : t('Translate')}
                </button>
              </div>
            </div>
          </div>

          {/* Target Output Card */}
          <div className="card bg-base-200/40 dark:bg-base-200/20 border border-base-200/90 shadow-xs rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between min-h-[280px] md:min-h-[400px]">
            <div className="w-full flex-1 relative">
              {isTranslating && !translatedText && (
                <div className="flex flex-col items-center justify-center h-full min-h-[160px] md:min-h-[280px] text-base-content/50 space-y-2 animate-pulse">
                  <span className="loading loading-dots loading-md text-primary" />
                  <span className="text-sm">{t('Please wait...')}</span>
                </div>
              )}

              <TextareaAutoSize
                name="translatedText"
                value={translatedText || ''}
                className={clsx(
                  'w-full border-none focus:outline-hidden p-0 text-base leading-relaxed bg-transparent resize-none min-h-[160px] md:min-h-[280px]',
                  isTranslating && !translatedText && 'hidden',
                )}
                placeholder={isTranslating ? t('Please wait...') : t('Translated text will appear here.')}
                readOnly
              />
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-base-200/60">
              <div className="flex items-center gap-1.5">
                {!!translatedText && (
                  <TTSButton
                    language={lastTranslateData.toLang === 'auto' ? i18n.language : lastTranslateData.toLang}
                    text={translatedText}
                  />
                )}
                {translatedCharCount > 0 && (
                  <span className="text-xs text-base-content/40 ml-1 font-mono tabular-nums">
                    {translatedCharCount} {translatedCharCount === 1 ? 'char' : 'chars'}
                  </span>
                )}
              </div>

              <div>
                {!!translatedText && !isTranslating && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost rounded-xl gap-1.5 text-base-content/70 hover:text-base-content"
                    title={t('Copy translated text')}
                    onClick={onCopyBtnClick}
                  >
                    <MdContentCopy size={16} />
                    <span>{t('Copy translation')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default TranslatorPage;
