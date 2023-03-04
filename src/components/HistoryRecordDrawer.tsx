import { t } from 'i18next';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaEllipsisV, FaHistory, FaTimes, FaTrashAlt } from 'react-icons/fa';

import { useGlobalStore } from '@/components/GlobalStore';
import { Language, LANGUAGES } from '@/constants';
import { formatTime } from '@/utils';

export function HistoryRecordButton() {
  return (
    <label
      htmlFor="history-record-drawer"
      className="drawer-button btn btn-primary btn-ghost btn-circle"
      title="History Record"
    >
      <FaHistory size={20} />
    </label>
  );
}

type Props = {
  children: React.ReactNode;
};

export function HistoryRecordDrawerLayout(props: Props) {
  const { children } = props;
  const { i18n } = useTranslation();
  const {
    history: { historyRecords, setHistoryRecords },
  } = useGlobalStore();

  const handleDeleteHistoryRecord = (id: string) => {
    (document.activeElement as HTMLElement).blur();
    setHistoryRecords((prev) => prev.filter((record) => record.id !== id));
    toast.success(t('Delete history record successfully.'));
  };

  const handleClearHistoryRecords = () => {
    (document.activeElement as HTMLElement).blur();
    setHistoryRecords([]);
    toast.success(t('Clear history records successfully.'));
  };

  const handleCopyOriginalText = (id: string) => {
    (document.activeElement as HTMLElement).blur();
    const record = historyRecords.find((record) => record.id === id);
    if (!record) {
      return;
    }
    navigator.clipboard.writeText(record.text);
    toast.success(t('Copy original text successfully.'));
  };

  const handleCopyTranslation = (id: string) => {
    (document.activeElement as HTMLElement).blur();
    const record = historyRecords.find((record) => record.id === id);
    if (!record) {
      return;
    }
    navigator.clipboard.writeText(record.translation);
    toast.success(t('Copy translation successfully.'));
  };

  return (
    <>
      <input id="history-record-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="history-record-drawer" className="drawer-overlay"></label>
        <div className="p-4 w-[28.75rem] max-w-[100vw] bg-base-100">
          <h1 className="sticky top-0 z-50 flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
            <span className="leading-[48px]">
              {t('History Record')}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="ml-6 btn-outline btn btn-error btn-xs">
                  <FaTrashAlt size={12} className="mr-2" />
                  {t('Clear All')}
                </label>
                <div
                  tabIndex={0}
                  className="w-64 p-2 shadow dropdown-content card card-compact bg-warning text-warning-content"
                >
                  <div className="card-body">
                    <h3 className="card-title">{t('Notice!')}</h3>
                    <p>{t('Do you really want to clear all history?')}</p>
                    <div className="flex justify-end">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => (document.activeElement as HTMLElement).blur()}
                      >
                        {t('Cancel')}
                      </button>
                      <button className="ml-2 btn btn-error btn-sm" onClick={handleClearHistoryRecords}>
                        {t('Yes')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </span>
            <label
              htmlFor="history-record-drawer"
              className="drawer-button btn btn-primary btn-ghost btn-circle"
              title="Close History Record Drawer"
            >
              <FaTimes size={20} />
            </label>
          </h1>
          <ul className="text-base-content">
            {!!historyRecords &&
              !!historyRecords.length &&
              historyRecords.map((record) => (
                <li key={record.id} className="my-2">
                  <div className="chat chat-end">
                    <div className="chat-header">
                      <span>
                        <span className="font-bold">
                          {LANGUAGES[record.fromLanguage as Language] || record.fromLanguage || 'Auto'}
                        </span>
                        <span className="mx-2">→</span>
                        <span className="font-bold">
                          {LANGUAGES[record.toLanguage as Language] || record.fromLanguage || 'Auto'}
                        </span>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="mx-1 btn btn-sm btn-ghost btn-circle">
                            <FaEllipsisV size={8} />
                          </label>
                          <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
                            <li>
                              <a onClick={() => handleDeleteHistoryRecord(record.id)} className="font-bold text-error">
                                {t('Delete this record')}
                              </a>
                            </li>
                            <li>
                              <a onClick={() => handleCopyOriginalText(record.id)}>{t('Copy original text')}</a>
                            </li>
                            <li>
                              <a onClick={() => handleCopyTranslation(record.id)}>{t('Copy translation')}</a>
                            </li>
                          </ul>
                        </div>
                      </span>
                      <time className="text-xs leading-8 opacity-50">
                        {formatTime(record.createdAt, i18n.language || 'en-US')}
                      </time>
                    </div>
                    <div className="chat-bubble">{record.text}</div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-info">{record.translation}</div>
                  </div>
                </li>
              ))}
            {(!historyRecords || !historyRecords.length) && <p className="">{t('No history record.')}</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
