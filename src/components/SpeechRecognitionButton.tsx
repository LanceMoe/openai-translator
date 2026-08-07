import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdOutlineMicNone, MdStop } from 'react-icons/md';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type Props = {
  language: string;
  onChangeTranscript: (newTranscript: string) => void;
} & React.ComponentPropsWithoutRef<'button'>;

export function SpeechRecognitionButton(props: Props) {
  const { language, onChangeTranscript, className, ...restProps } = props;
  const { t } = useTranslation();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    onChangeTranscript(transcript);
  }, [onChangeTranscript, transcript]);

  const onClickSpeechRecognitionBtn = useCallback(() => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({
        language: language === 'wyw' ? 'zh-TW' : language,
        continuous: true,
      });
      toast.success(t('Recording started.'));
    } else {
      SpeechRecognition.stopListening();
      toast.success(t('Recording stopped.'));
    }
  }, [language, listening, resetTranscript, t]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      className={clsx('btn btn-circle btn-sm', listening ? 'btn-error' : 'btn-ghost', className)}
      title={listening ? t('Stop speaking') : t('Start speaking')}
      onClick={onClickSpeechRecognitionBtn}
      {...restProps}
      type="button"
    >
      {listening ? <MdStop size="16" /> : <MdOutlineMicNone size="16" />}
    </button>
  );
}
