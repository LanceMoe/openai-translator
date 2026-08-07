import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdOutlineVolumeUp, MdStop } from 'react-icons/md';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  language: string;
  text: string;
  size?: ButtonSize;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'size'>;

export function TTSButton(props: Props) {
  const { language, text, className, size = 'sm', ...restProps } = props;
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const utterance = useMemo(() => new SpeechSynthesisUtterance(), []);

  useEffect(() => {
    utterance.lang = language === 'wyw' ? 'zh-TW' : language;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.text = text;
    utterance.onend = () => {
      setRecording(false);
      window.speechSynthesis.cancel();
    };
    utterance.onerror = () => {
      toast.error(t('Something went wrong, please try again later.'));
      setRecording(false);
      window.speechSynthesis.cancel();
    };
    utterance.onstart = () => {
      setRecording(true);
    };
  }, [language, t, text, utterance]);

  const onClickTTSBtn = useCallback(() => {
    if (recording) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    } else {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [recording, utterance]);

  return (
    <button
      className={clsx('btn btn-circle', `btn-${size}`, recording ? 'btn-error' : 'btn-ghost', className)}
      title={recording ? t('Stop reading') : t('Start reading')}
      onClick={onClickTTSBtn}
      {...restProps}
      type="button"
    >
      {recording ? <MdStop size="16" /> : <MdOutlineVolumeUp size="16" />}
    </button>
  );
}
