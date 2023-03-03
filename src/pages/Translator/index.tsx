import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import TextareaAutosize from 'react-textarea-autosize';

function TranslatorPage() {
  const { t } = useTranslation();

  const handleTranslate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // const { openaiApiKey } = Object.fromEntries(formData.entries());

    // if (!openaiApiKey) {
    //   toast.error('Please enter your API Key.');
    //   return;
    // }
    // toast.success('API Key Saved!');
  };

  return (
    <>
      <div className="sticky z-40 w-full max-w-full p-4 m-0 shadow-md top-16 bg-base-100">
        <form method="post" onSubmit={handleTranslate}>
          <div className="flex flex-row mb-2">
            <select className="w-5/12 select">
              <option selected>自动检测</option>
              <option>Lost</option>
            </select>

            <div className="flex justify-center w-2/12">
              <button type="button" className="btn btn-circle btn-ghost">
                <CgArrowsExchange size={20} />
              </button>
            </div>

            <select className="w-5/12 select">
              <option selected>自动检测</option>
              <option>Lost</option>
            </select>
          </div>

          <div className="form-control">
            <TextareaAutosize
              name="openaiApiKey"
              className="w-full mb-2 break-all rounded-2xl textarea textarea-md textarea-primary"
              placeholder="Please enter the text you want to translate here."
              required
            ></TextareaAutosize>
            <button type="submit" className="btn btn-primary">
              Translate
            </button>
          </div>
        </form>
      </div>
      <div className="grid w-full max-w-full grid-cols-1 gap-4 p-4 m-0 mb-12">
        <TextareaAutosize
          name="openaiApiKey"
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
