import { useClickOutside } from '@mantine/hooks';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  MdClose,
  MdFlashOn,
  MdKey,
  MdLink,
  MdOpenInNew,
  MdRestartAlt,
  MdSave,
  MdSecurity,
  MdSettings,
  MdTune,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';

import { CHAT_MODELS, type ChatModel } from '@/constants';
import { useGlobalStore } from '@/hooks/useGlobalStore';

function ConfigPage() {
  const { t } = useTranslation();
  const {
    configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
    setConfigValues,
  } = useGlobalStore();
  const openaiApiInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [selectedTemperature, setSelectedTemperature] = useState(temperatureParam);
  const [showApiKey, setShowApiKey] = useState(false);
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
    <div className="h-full w-full max-w-[30rem] flex flex-col justify-between overflow-x-hidden bg-base-100 shadow-2xl border-l border-base-200">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-base-200 bg-base-100/90 backdrop-blur-md px-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <MdSettings size={19} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-base-content">{t('Config')}</h1>
        </div>
        <label
          htmlFor="config-drawer"
          className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
          title={t('Close')}
        >
          <MdClose size={18} />
        </label>
      </header>

      {/* Form Content */}
      <form method="post" className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-4" onSubmit={handleSave}>
        {/* Connection Section Card */}
        <section className="card bg-base-200/40 dark:bg-base-200/20 border border-base-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 pb-1 border-b border-base-200/60">
            <MdLink size={16} className="text-primary" />
            <span>{t('Connection')}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-base-content/80">{t('OpenAI API Url')}</span>
              <a
                className="link link-primary text-xs flex items-center gap-1 hover:underline"
                href="#"
                onClick={handleResetOpenaiApiUrl}
              >
                <MdRestartAlt size={13} />
                <span>{t('Reset to default')}</span>
              </a>
            </div>
            <input
              ref={openaiApiInputRef}
              name="openaiApiUrl"
              className="input input-bordered input-sm sm:input-md w-full rounded-xl bg-base-100 font-mono text-xs sm:text-sm focus:input-primary transition-all"
              placeholder={t('Please input OpenAI API Url here.')}
              defaultValue={openaiApiUrl}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-base-content/80 flex items-center gap-1">
                <MdKey size={14} className="text-primary" />
                {t('OpenAI API Key')}
              </span>
              <a
                className="link link-primary text-xs flex items-center gap-1 hover:underline"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>{t('Get your OpenAI API Key')}</span>
                <MdOpenInNew size={11} />
              </a>
            </div>
            <div className="relative">
              <textarea
                name="openaiApiKey"
                className={clsx(
                  'textarea textarea-bordered w-full rounded-xl bg-base-100 text-xs sm:text-sm font-mono min-h-20 resize-y leading-5 pr-10 focus:textarea-primary transition-all',
                  !showApiKey && 'select-none',
                )}
                style={!showApiKey ? ({ WebkitTextSecurity: 'disc' } as React.CSSProperties) : undefined}
                placeholder={t('Please paste your OpenAI API Key here.')}
                defaultValue={openaiApiKey}
                required
              />
              <button
                type="button"
                onClick={() => setShowApiKey((prev) => !prev)}
                className="absolute right-2.5 top-2.5 btn btn-ghost btn-circle btn-xs text-base-content/50 hover:text-base-content"
                title={showApiKey ? 'Hide Key' : 'Show Key'}
              >
                {showApiKey ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-base-content/50 flex items-center gap-1 pt-0.5">
              <MdSecurity size={13} className="text-success shrink-0" />
              <span>{t('API Key is stored locally in your browser only.')}</span>
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <MdFlashOn size={16} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-base-content">{t('Use stream (typing effect)')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary shrink-0"
              name="streamEnabled"
              defaultChecked={streamEnabled}
            />
          </div>
        </section>

        {/* Generation & Model Section Card */}
        <section className="card bg-base-200/40 dark:bg-base-200/20 border border-base-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 pb-1 border-b border-base-200/60">
            <MdTune size={16} className="text-primary" />
            <span>{t('Generation')}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-base-content/80 block">{t('Model (engine)')}</label>
            <div
              className={clsx('dropdown w-full', isModelMenuOpen && suggestedModels.length > 0 && 'dropdown-open')}
              ref={modelMenuRef}
            >
              <input
                type="text"
                className="input input-bordered input-sm sm:input-md w-full rounded-xl bg-base-100 font-mono text-xs sm:text-sm focus:input-primary transition-all"
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
              <ul className="menu menu-sm dropdown-content z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-base-200 bg-base-100 p-1.5 shadow-xl">
                {suggestedModels.map((model) => (
                  <li key={model}>
                    <button
                      type="button"
                      className={clsx(
                        'rounded-lg py-2 font-mono text-xs flex justify-between items-center',
                        selectedModel === model && 'active font-semibold',
                      )}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelFilterActive(false);
                        setIsModelMenuOpen(false);
                      }}
                    >
                      <span>{model}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-base-content/80">{t('Temperature')}</span>
              <span className="badge badge-primary badge-sm font-mono font-semibold tabular-nums">
                {selectedTemperature.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-base-content/60 leading-tight">
              {t('Higher temperature will be more creative.')}
            </p>
            <input
              type="range"
              name="temperatureParam"
              min="0.0"
              max="1.0"
              value={selectedTemperature}
              className="range range-primary range-sm"
              step="0.1"
              onChange={(event) => setSelectedTemperature(+event.target.value)}
            />
            <div className="flex justify-between text-[11px] text-base-content/50 font-mono">
              <span>0.0 (精确)</span>
              <span>0.2 (推荐)</span>
              <span>0.6</span>
              <span>1.0 (创意)</span>
            </div>
          </div>
        </section>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 -mb-5 border-t border-base-200 bg-base-100/90 backdrop-blur-md p-4 sm:p-5">
          <button type="submit" className="btn btn-primary btn-block rounded-xl font-semibold shadow-xs gap-2">
            <MdSave size={18} />
            <span>{t('Save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
