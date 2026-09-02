import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaHistory, FaTrashAlt } from 'react-icons/fa';
import { MdContentCopy, MdDeleteOutline } from 'react-icons/md';

import { TTSButton } from '@/components/TTSButton';
import { Language, LANGUAGES } from '@/constants';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { formatTime } from '@/utils';

function HistoryRecord() {
  const { t, i18n } = useTranslation();
  const {
    history: { historyRecords, setHistoryRecords },
  } = useGlobalStore();

  const handleDeleteHistoryRecord = useCallback(
    (id: string) => {
      setHistoryRecords((prev) => prev.filter((record) => record.id !== id));
      toast.success(t('Delete history record successfully.'));
    },
    [setHistoryRecords, t],
  );

  const handleClearHistoryRecords = useCallback(() => {
    (document.activeElement as HTMLElement)?.blur?.();
    setHistoryRecords([]);
    toast.success(t('Clear history records successfully.'));
  }, [setHistoryRecords, t]);

  const handleCopyOriginalText = useCallback(
    (id: string) => {
      const record = historyRecords.find((record) => record.id === id);
      if (!record) {
        return;
      }
      navigator.clipboard.writeText(record.text);
      toast.success(t('Copy original text successfully.'));
    },
    [historyRecords, t],
  );

  const handleCopyTranslation = useCallback(
    (id: string) => {
      const record = historyRecords.find((record) => record.id === id);
      if (!record) {
        return;
      }
      navigator.clipboard.writeText(record.translation);
      toast.success(t('Copy translation successfully.'));
    },
    [historyRecords, t],
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 mb-20 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-base-200">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <FaHistory size={16} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-base-content">{t('History Record')}</h1>
          {!!historyRecords.length && (
            <span className="badge badge-sm badge-ghost font-mono tabular-nums">{historyRecords.length}</span>
          )}
        </div>

        {!!historyRecords.length && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-xs text-error gap-1.5 rounded-lg hover:bg-error/10">
              <FaTrashAlt size={11} />
              <span>{t('Clear All')}</span>
            </label>
            <div
              tabIndex={0}
              className="z-50 w-72 p-4 shadow-xl dropdown-content card bg-base-100 border border-base-200 text-base-content rounded-2xl"
            >
              <h3 className="font-bold text-sm">{t('Notice!')}</h3>
              <p className="text-xs text-base-content/70 py-2">{t('Do you really want to clear all history?')}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-xs btn-ghost rounded-lg"
                  onClick={() => (document.activeElement as HTMLElement)?.blur?.()}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-error rounded-lg text-error-content"
                  onClick={handleClearHistoryRecords}
                >
                  {t('Yes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {historyRecords.map((record) => (
          <div
            key={record.id}
            className="card bg-base-100 border border-base-200/90 shadow-xs hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 space-y-3"
          >
            {/* Record Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-base-200/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-xs text-base-content/80">
                  {LANGUAGES[record.fromLanguage as Language] || record.fromLanguage || 'Auto'}
                </span>
                <span className="text-xs text-primary font-bold">➔</span>
                <span className="font-semibold text-xs text-primary">
                  {LANGUAGES[record.toLanguage as Language] || record.toLanguage || 'Auto'}
                </span>
                {!!record.style && (
                  <span className="badge badge-ghost badge-xs rounded-md text-[10px] font-medium text-base-content/70">
                    {t(`style_${record.style}`)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <time className="text-xs text-base-content/40 font-mono">
                  {formatTime(record.createdAt, i18n.language || 'en-US')}
                </time>
                <button
                  type="button"
                  onClick={() => handleDeleteHistoryRecord(record.id)}
                  className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-error transition-colors"
                  title={t('Delete this record')}
                >
                  <MdDeleteOutline size={16} />
                </button>
              </div>
            </div>

            {/* Record Body: Source & Translation */}
            <div className="space-y-2.5 text-sm">
              <div className="p-3 bg-base-200/50 rounded-xl flex items-start justify-between gap-2">
                <p className="whitespace-pre-line break-words flex-1 text-base-content/80">{record.text}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <TTSButton
                    language={record.fromLanguage === 'auto' ? i18n.language : record.fromLanguage}
                    text={record.text}
                    size="xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyOriginalText(record.id)}
                    className="btn btn-ghost btn-circle btn-xs text-base-content/60"
                    title={t('Copy original text')}
                  >
                    <MdContentCopy size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-xl flex items-start justify-between gap-2">
                <p className="whitespace-pre-line break-words flex-1 text-base-content font-medium">
                  {record.translation}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <TTSButton
                    language={record.toLanguage === 'auto' ? i18n.language : record.toLanguage}
                    text={record.translation}
                    size="xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyTranslation(record.id)}
                    className="btn btn-ghost btn-circle btn-xs text-primary"
                    title={t('Copy translation')}
                  >
                    <MdContentCopy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!historyRecords?.length && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="size-16 rounded-full bg-base-200 flex items-center justify-center text-base-content/30">
              <FaHistory size={28} />
            </div>
            <p className="text-sm font-medium text-base-content/60">{t('No history record.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryRecord;
