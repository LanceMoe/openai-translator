import clsx from 'clsx';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import { useMutation } from 'react-query';
import TextareaAutosize from 'react-textarea-autosize';

import { fetchTranslation } from '@/client/fetcher';
import { useGlobalStore } from '@/components/GlobalStore';

function TranslatorPage() {
  const { t } = useTranslation();

  const { openaiApiKey, currentModel } = useGlobalStore();
  const { data: translatedText, mutate, isLoading, isError } = useMutation('translator', fetchTranslation);

  const handleTranslate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!openaiApiKey) {
      toast.error('Please enter your API Key in config page first!');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const { translateText } = Object.fromEntries(formData.entries());
    if (!translateText) {
      return;
    }
    mutate({
      token: openaiApiKey,
      engine: currentModel,
      prompt: '翻译成简体白话文',
      queryText: translateText as string,
    });
  };

  useEffect(() => {
    if (!isError) {
      return;
    }
    toast.error('Something went wrong, please try again later.');
  }, [isError]);

  return (
    <>
      <div className="w-full max-w-full p-4 m-0 shadow-md top-16 bg-base-100">
        <form method="post" onSubmit={handleTranslate}>
          <div className="flex flex-row mb-2">
            <select className="w-5/12 select" defaultValue={'自动检测'}>
              <option value="自动检测">自动检测</option>
              <option value="Lost">Lost</option>
            </select>

            <div className="flex justify-center w-2/12">
              <button type="button" className="btn btn-circle btn-ghost">
                <CgArrowsExchange size={20} />
              </button>
            </div>

            <select className="w-5/12 select" defaultValue={'自动检测'}>
              <option value="自动检测">自动检测</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="form-control">
            <TextareaAutosize
              name="translateText"
              className="w-full mb-2 break-all rounded-2xl textarea textarea-md textarea-primary"
              placeholder="Please enter the text you want to translate here."
              required
            ></TextareaAutosize>

            <button type="submit" className={clsx('btn btn-primary', isLoading && 'loading')} disabled={isLoading}>
              Translate
            </button>
          </div>
        </form>
      </div>
      <div className="grid w-full max-w-full grid-cols-1 gap-4 p-4 m-0 mb-12">
        <TextareaAutosize
          name="translatedText"
          value={translatedText}
          className="w-full mb-2 break-all rounded-2xl textarea textarea-md textarea-ghost"
          placeholder="Translated text will appear here."
          readOnly
          required
        ></TextareaAutosize>
      </div>
    </>
  );
}

export default TranslatorPage;
