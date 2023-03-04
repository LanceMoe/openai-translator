import { useTranslation } from 'react-i18next';
import { FaHistory, FaRegWindowClose } from 'react-icons/fa';

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

  return (
    <>
      <input id="history-record-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="history-record-drawer" className="drawer-overlay"></label>
        <div className="p-4 w-[28.75rem] max-w-[100vw] bg-base-100">
          <h1 className="sticky top-0 z-50 flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
            <span className="leading-[48px]">History Record</span>
            <label
              htmlFor="history-record-drawer"
              className="drawer-button btn btn-primary btn-ghost btn-circle"
              title="Close History Record Drawer"
            >
              <FaRegWindowClose size={20} />
            </label>
          </h1>

          <ul className="text-base-content">
            {!!historyRecords &&
              !!historyRecords.length &&
              historyRecords.map((record) => (
                <li key={record.id} className="mb-2">
                  <div className="chat chat-end">
                    <div className="chat-header">
                      <p>
                        <span className="font-bold">
                          {LANGUAGES[record.fromLanguage as Language] || record.fromLanguage || 'Auto'}
                        </span>
                        <span className="mx-2">→</span>
                        <span className="font-bold">
                          {LANGUAGES[record.toLanguage as Language] || record.fromLanguage || 'Auto'}
                        </span>
                      </p>
                      <time className="text-xs opacity-50">
                        {formatTime(record.createdAt, i18n.language || 'en-US')}
                      </time>
                    </div>
                    <div className="chat-bubble">{record.text}</div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble">{record.translation}</div>
                  </div>
                </li>
              ))}
            {(!historyRecords || !historyRecords.length) && <p className="">No history record.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
