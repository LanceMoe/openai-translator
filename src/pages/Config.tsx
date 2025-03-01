import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Toggle } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import apis from '@/client/apis';
import { useGlobalStore } from '@/components/GlobalStore';
import type { ChatModel } from '@/constants';

function ConfigPage() {
  const { t } = useTranslation();
  const {
    configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
    setConfigValues,
    availableModels,
    setAvailableModels,
  } = useGlobalStore();

  const openaiApiInputRef = useRef<HTMLInputElement>(null);
  const [apiUrl, setApiUrl] = useState(openaiApiUrl);
  const [apiKey, setApiKey] = useState(openaiApiKey);
  const [isLoading, setIsLoading] = useState(false);

  const fetchModelsFromAPI = useCallback(
    async (url: string, key: string) => {
      if (!url || !key) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${url}${apis.endpoints.v1.models.url}`, {
          method: apis.endpoints.v1.models.method,
          headers: {
            ...apis.endpoints.v1.models.headers,
            Authorization: `Bearer ${key}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch models');
        }

        const data = await response.json();
        const models = data.data.map((model: { id: string }) => ({ id: model.id, name: model.id }));
        setAvailableModels(models);
        toast.success(t('Models loaded successfully'));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error fetching models: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setAvailableModels, t],
  );

  // Initial fetch of models when component mounts and credentials are available
  useEffect(() => {
    if (openaiApiUrl && openaiApiKey && availableModels.length === 0) {
      fetchModelsFromAPI(openaiApiUrl, openaiApiKey);
    }
  }, [openaiApiUrl, openaiApiKey, availableModels.length, fetchModelsFromAPI]);

  const handleApiUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setApiUrl(newUrl);
      if (newUrl && apiKey) {
        fetchModelsFromAPI(newUrl, apiKey);
      }
    },
    [apiKey, fetchModelsFromAPI],
  );

  const handleApiKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newKey = e.target.value;
      setApiKey(newKey);
      if (apiUrl && newKey) {
        fetchModelsFromAPI(apiUrl, newKey);
      }
    },
    [apiUrl, fetchModelsFromAPI],
  );

  const handleResetOpenaiApiUrl = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const inputRef = openaiApiInputRef.current;
      if (!inputRef) {
        return;
      }
      const defaultUrl = 'https://api.openai.com';
      inputRef.value = defaultUrl;
      setApiUrl(defaultUrl);
      if (defaultUrl && apiKey) {
        fetchModelsFromAPI(defaultUrl, apiKey);
      }
      inputRef.focus();
      // eslint-disable-next-line quotes
      toast(t("Don't forget to click the save button for the settings to take effect!"));
    },
    [t, apiKey, fetchModelsFromAPI],
  );

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

  return (
    <div className="p-6 w-[28.75rem] max-w-[100vw] bg-base-100 overflow-y-auto overflow-x-hidden h-full">
      <h1 className="sticky top-0 z-50 flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
        <span className="leading-[48px]">{t('Config')}</span>
        <label
          htmlFor="history-record-drawer"
          className="drawer-button btn btn-primary btn-ghost btn-circle"
          title={t('Close')}
        >
          <FaTimes size={20} />
        </label>
      </h1>
      <form method="post" onSubmit={handleSave}>
        <div className="mb-2 form-control">
          <label htmlFor="streamEnabled" className="label">
            <span className="text-lg font-bold label-text">{t('Use stream (typing effect)')}</span>
            <Toggle color="primary" name="streamEnabled" id="streamEnabled" defaultChecked={streamEnabled} />
          </label>
        </div>
        <div className="mb-2 form-control">
          <label htmlFor="openaiApiUrl" className="label">
            <span className="text-lg font-bold label-text">{t('OpenAI API Url')}</span>
            <span className="label-text-alt">
              <button type="button" className="link link-primary" onClick={handleResetOpenaiApiUrl}>
                {t('Reset to default')}
              </button>
            </span>
          </label>
          <Input
            ref={openaiApiInputRef}
            name="openaiApiUrl"
            id="openaiApiUrl"
            color="primary"
            className="break-all"
            placeholder={t('Please input OpenAI API Url here.')}
            defaultValue={openaiApiUrl}
            onChange={handleApiUrlChange}
            required
          />
        </div>
        <div className="mb-2 form-control">
          <label htmlFor="openaiApiKey" className="label">
            <span className="text-lg font-bold label-text">{t('OpenAI API Key')}</span>
            <span className="label-text-alt">
              <a
                className="link link-primary"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer noopener"
              >
                {t('Get your OpenAI API Key')}
              </a>
            </span>
          </label>
          <textarea
            name="openaiApiKey"
            id="openaiApiKey"
            className="h-24 break-all resize-none rounded-2xl textarea textarea-md textarea-primary"
            placeholder={t('Please paste your OpenAI API Key here.')}
            defaultValue={openaiApiKey}
            onChange={handleApiKeyChange}
            required
          />
        </div>
        <div className="mb-2 form-control">
          <label htmlFor="selectedModel" className="label">
            <span className="text-lg font-bold label-text">{t('Model (engine)')}</span>
          </label>
          <select
            className="w-full select select-primary"
            defaultValue={currentModel}
            name="selectedModel"
            id="selectedModel"
            title="Selected model"
          >
            {availableModels.length > 0 ? (
              availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))
            ) : (
              <option value={currentModel}>{currentModel}</option>
            )}
          </select>
          {isLoading && <p className="mt-1 text-sm">{t('Loading models...')}</p>}
          {!isLoading && availableModels.length === 0 && apiUrl && apiKey && (
            <button
              type="button"
              className="mt-2 btn btn-sm btn-outline btn-primary"
              onClick={() => fetchModelsFromAPI(apiUrl, apiKey)}
            >
              {t('Fetch models')}
            </button>
          )}
        </div>
        <div className="mb-4 form-control">
          <label htmlFor="temperatureParam" className="label">
            <span className="text-lg font-bold label-text">{t('Temperature')}</span>
            <span className="label-text-alt">{t('Higher temperature will be more creative.')}</span>
          </label>
          <input
            type="range"
            name="temperatureParam"
            id="temperatureParam"
            min="0.4"
            max="1.0"
            defaultValue={temperatureParam}
            className="range range-primary"
            step="0.1"
          />
          <div className="flex justify-between w-full pl-0 pr-1 text-xs">
            <span>rad</span>
            <span>0.5</span>
            <span>0.6</span>
            <span>0.7</span>
            <span>0.8</span>
            <span>0.9</span>
            <span>1.0</span>
          </div>
        </div>
        <div className="form-control">
          <Button type="submit" color="primary">
            {t('Save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
