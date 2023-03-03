import { useTranslation } from 'react-i18next';

function TranslatorPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="sticky z-40 w-full max-w-full p-4 m-0 shadow-md top-16 bg-base-100"></div>

      <div className="grid w-full max-w-full grid-cols-1 gap-4 p-4 m-0 mb-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"></div>
    </>
  );
}

export default TranslatorPage;
