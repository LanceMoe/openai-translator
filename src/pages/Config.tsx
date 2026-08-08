import { useClickOutside } from '@mantine/hooks';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import { useGlobalStore } from '@/components/GlobalStore';
import { CHAT_MODELS, type ChatModel } from '@/constants';

function ConfigPage() {
  const { t } = useTranslation();
  const {
    configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
    setConfigValues,
  } = useGlobalStore();
  const openaiApiInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [selectedTemperature, setSelectedTemperature] = useState(temperatureParam);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isModelFilterActive, setIsModelFilterActive] = useState(false);
  const modelMenuRef = useClickOutside<HTMLDivElement>(() => setIsModelMenuOpen(false));
  const suggestedModels = isModelFilterActive
    ? CHAT_MODELS.filter((model) => model.toLowerCase().includes(selectedModel.toLowerCase()))
    : CHAT_MODELS;

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const { openaiApiUrl, openaiApiKey, streamEnabled, selectedModel, temperatureParam } = Object.fromEntries(
        formData.entries(),
      );
      if (!openaiApiUrl) {
        toast.error(t('Please enter API Url.'));
        return;
      }
      if (!openaiApiKey) {
        toast.error(t('Please enter your API Key.'));
        return;
      }
      if (!selectedModel) {
        toast.error(t('Please select a model.'));
        return;
      }
      setConfigValues((prev) => ({
        ...prev,
        openaiApiUrl: `${openaiApiUrl}`,
        openaiApiKey: `${openaiApiKey}`,
        streamEnabled: streamEnabled === 'on',
        currentModel: selectedModel as ChatModel,
        temperatureParam: +temperatureParam,
      }));
      toast.success(t('Config Saved!'));
    },
    [setConfigValues, t],
  );

  const handleResetOpenaiApiUrl = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const inputRef = openaiApiInputRef.current;
      if (!inputRef) {
        return;
      }
      inputRef.value = 'https://api.openai.com';
      inputRef.focus();
      // eslint-disable-next-line quotes
      toast(t("Don't forget to click the save button for the settings to take effect!"));
    },
    [t],
  );

  return (
    <div className="h-full w-full max-w-[28.75rem] overflow-x-hidden overflow-y-auto bg-base-100">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-base-300 bg-base-100 px-4 sm:px-6">
        <h1 className="text-xl font-bold">{t('Config')}</h1>
        <label htmlFor="history-record-drawer" className="drawer-button btn btn-ghost btn-circle" title={t('Close')}>
          <FaTimes size={20} />
        </label>
      </header>
      <form method="post" className="px-4 pb-4 pt-4 sm:px-6" onSubmit={handleSave}>
        <section className="space-y-3" aria-labelledby="connection-settings-title">
          <h2 id="connection-settings-title" className="text-sm font-semibold text-base-content/60">
            {t('Connection')}
          </h2>
          <fieldset className="fieldset gap-1">
            <legend className="fieldset-legend flex w-full items-center justify-between gap-3 text-base font-semibold">
              <span>{t('OpenAI API Url')}</span>
              <a className="link link-primary text-sm whitespace-nowrap" href="#" onClick={handleResetOpenaiApiUrl}>
                {t('Reset to default')}
              </a>
            </legend>
            <input
              ref={openaiApiInputRef}
              name="openaiApiUrl"
              className="input input-primary w-full"
              placeholder={t('Please input OpenAI API Url here.')}
              defaultValue={openaiApiUrl}
              required
            />
          </fieldset>
          <fieldset className="fieldset gap-1">
            <legend className="fieldset-legend flex w-full items-center justify-between gap-3 text-base font-semibold">
              <span>{t('OpenAI API Key')}</span>
              <a
                className="link link-primary text-sm whitespace-nowrap"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer noopener"
              >
                {t('Get your OpenAI API Key')}
              </a>
            </legend>
            <textarea
              name="openaiApiKey"
              className="textarea textarea-primary min-h-24 w-full resize-y leading-6"
              placeholder={t('Please paste your OpenAI API Key here.')}
              defaultValue={openaiApiKey}
              required
            ></textarea>
          </fieldset>
          <div className="flex items-center justify-between gap-4 pt-4">
            <p className="font-semibold">{t('Use stream (typing effect)')}</p>
            <input
              type="checkbox"
              className="toggle toggle-primary shrink-0"
              name="streamEnabled"
              defaultChecked={streamEnabled}
            />
          </div>
        </section>

        <div className="divider my-4"></div>

        <section className="space-y-4" aria-labelledby="generation-settings-title">
          <h2 id="generation-settings-title" className="text-sm font-semibold text-base-content/60">
            {t('Generation')}
          </h2>
          <fieldset className="fieldset gap-1">
            <legend className="fieldset-legend text-base font-semibold">{t('Model (engine)')}</legend>
            <div
              className={clsx('dropdown w-full', isModelMenuOpen && suggestedModels.length > 0 && 'dropdown-open')}
              ref={modelMenuRef}
            >
              <input
                type="text"
                className="input input-primary w-full"
                value={selectedModel}
                name="selectedModel"
                title="Selected model"
                autoComplete="off"
                onChange={(event) => {
                  setSelectedModel(event.target.value);
                  setIsModelFilterActive(true);
                  setIsModelMenuOpen(true);
                }}
                onFocus={() => {
                  setIsModelFilterActive(false);
                  setIsModelMenuOpen(true);
                }}
                onClick={() => {
                  setIsModelFilterActive(false);
                  setIsModelMenuOpen(true);
                }}
                required
              />
              <ul className="menu menu-sm dropdown-content z-50 mt-2 max-h-48 w-full overflow-y-auto rounded-box border border-base-300 bg-base-100 shadow">
                {suggestedModels.map((model) => (
                  <li key={model}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelFilterActive(false);
                        setIsModelMenuOpen(false);
                      }}
                    >
                      {model}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </fieldset>

          <fieldset className="fieldset gap-2">
            <legend className="fieldset-legend flex w-full items-center justify-between gap-3 text-base font-semibold">
              <span>{t('Temperature')}</span>
              <output className="badge badge-primary badge-sm font-medium tabular-nums">
                {selectedTemperature.toFixed(1)}
              </output>
            </legend>
            <p className="label">{t('Higher temperature will be more creative.')}</p>
            <input
              type="range"
              name="temperatureParam"
              min="0.4"
              max="1.0"
              value={selectedTemperature}
              className="range range-primary"
              step="0.1"
              onChange={(event) => setSelectedTemperature(+event.target.value)}
            />
            <div className="flex justify-between text-xs text-base-content/60">
              <span>0.4</span>
              <span>0.5</span>
              <span>0.6</span>
              <span>0.7</span>
              <span>0.8</span>
              <span>0.9</span>
              <span>1.0</span>
            </div>
          </fieldset>
        </section>

        <div className="sticky bottom-0 z-10 -mx-4 mt-5 border-t border-base-300 bg-base-100 px-4 pb-0 pt-3 sm:-mx-6 sm:px-6">
          <button type="submit" className="btn btn-primary btn-block">
            {t('Save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
