import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const langCode = localStorage.getItem('langCode');

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    defaultNS: 'translation',
    lng: langCode ? langCode.slice(1, -1) : 'zh',
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    fallbackLng: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    returnNull: false,
    react: {
      useSuspense: true,
    },
  });

export default i18n;
