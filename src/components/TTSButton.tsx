import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdOutlineVolumeUp, MdStop } from 'react-icons/md';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  language: string;
  text: string;
  size?: ButtonSize;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'size'>;

let activeUtterance: SpeechSynthesisUtterance | null = null;
const cancelledUtterances = new WeakSet<SpeechSynthesisUtterance>();

function stopActiveUtterance() {
  if (activeUtterance) {
    cancelledUtterances.add(activeUtterance);
    activeUtterance = null;
  }
  window.speechSynthesis.cancel();
}

export function TTSButton(props: Props) {
  const { language, text, className, size = 'sm', ...restProps } = props;
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = language === 'wyw' ? 'zh-TW' : language;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.text = text;
    utterance.onend = () => {
      if (activeUtterance === utterance) {
        activeUtterance = null;
      }
      cancelledUtterances.delete(utterance);
      setRecording(false);
    };
    utterance.onerror = () => {
      const wasCancelled = cancelledUtterances.delete(utterance);
      if (activeUtterance === utterance) {
        activeUtterance = null;
      }
      setRecording(false);
      if (!wasCancelled) {
        toast.error(t('Something went wrong, please try again later.'));
      }
    };
    utterance.onstart = () => {
      if (activeUtterance === utterance) {
        setRecording(true);
      }
    };
    utteranceRef.current = utterance;

    return () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
      }
    };
  }, [language, t, text]);

  const onClickTTSBtn = useCallback(() => {
    const utterance = utteranceRef.current;
    if (!utterance) {
      return;
    }

    if (activeUtterance === utterance) {
      stopActiveUtterance();
      setRecording(false);
      return;
    }

    stopActiveUtterance();
    cancelledUtterances.delete(utterance);
    activeUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      if (activeUtterance === utterance) {
        activeUtterance = null;
      }
      setRecording(false);
      toast.error(t('Something went wrong, please try again later.'));
    }
  }, [t]);

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
