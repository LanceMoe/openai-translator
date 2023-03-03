import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';

function ConfigPage() {
  const { t } = useTranslation();
  const [openaiApiKey, setOpenAiApiKey] = useLocalStorage('openai-api-key', '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { openaiApiKey } = Object.fromEntries(formData.entries());

    if (!openaiApiKey) {
      toast.error('Please enter your API Key.');
      return;
    }
    setOpenAiApiKey(`${openaiApiKey}`);
    toast.success('API Key Saved!');
  };

  return (
    <div className="w-full max-w-full p-4 m-0 mb-12">
      <form method="post" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">OpenAI API Key</span>
            <span className="label-text-alt">
              Click&nbsp;
              <a
                className="link link-primary"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              &nbsp;to get your OpenAI API Key.
            </span>
          </label>
          <textarea
            name="openaiApiKey"
            className="h-24 mb-2 break-all rounded-2xl textarea textarea-md textarea-primary"
            placeholder="Plsase paste your OpenAI API Key here."
            defaultValue={openaiApiKey}
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Save API Key
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
