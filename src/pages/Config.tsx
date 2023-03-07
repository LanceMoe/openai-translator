import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/components/GlobalStore';
import { OPENAI_MODELS_TITLES } from '@/constants';
import { OpenAIModel } from '@/types';

function ConfigPage() {
  const { t } = useTranslation();
  const { openaiApiKey, setOpenAiApiKey, currentModel, setCurrentModel, extraConfig, setExtraConfig } =
    useGlobalStore();

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { openaiApiKey, selectedModel, tempretureParam } = Object.fromEntries(formData.entries());
    if (!openaiApiKey) {
      toast.error(t('Please enter your API Key.'));
      return;
    }
    if (!selectedModel) {
      toast.error(t('Please select a model.'));
      return;
    }
    setOpenAiApiKey(`${openaiApiKey}`);
    setCurrentModel(selectedModel as OpenAIModel);
    setExtraConfig((prev) => ({
      ...prev,
      tempretureParam: +tempretureParam,
    }));
    toast.success(t('Config Saved!'));
  };

  return (
    <div className="container max-w-screen-md p-4 m-0 mb-12 md:mx-auto">
      <form method="post" onSubmit={handleSave}>
        <div className="mb-2 form-control">
          <label className="label">
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
            className="h-24 break-all resize-none rounded-2xl textarea textarea-md textarea-primary"
            placeholder={t('Plsase paste your OpenAI API Key here.')}
            defaultValue={openaiApiKey}
            required
          ></textarea>
        </div>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Model (engine)')}</span>
          </label>
          <select
            className="w-full select select-primary"
            defaultValue={currentModel}
            name="selectedModel"
            title="Selected model"
          >
            {Object.keys(OPENAI_MODELS_TITLES).map((model) => (
              <option key={model} value={model}>
                {OPENAI_MODELS_TITLES[model as OpenAIModel]}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Tempreture')}</span>
            <span className="label-text-alt">{t('Higher tempreture will be more creative.')}</span>
          </label>
          <input
            type="range"
            name="tempretureParam"
            min="0.9"
            max="1.5"
            defaultValue={extraConfig.tempretureParam}
            className="range range-primary"
            step="0.1"
          />
          <div className="flex justify-between w-full pl-0 pr-1 text-xs">
            <span>rad</span>
            <span>1.0</span>
            <span>1.1</span>
            <span>1.2</span>
            <span>1.3</span>
            <span>1.4</span>
            <span>1.5</span>
          </div>
        </div>
        <div className="form-control">
          <button type="submit" className="btn btn-primary">
            {t('Save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
