import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-daisyui';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdOutlineVolumeUp, MdStop } from 'react-icons/md';

type Props = {
  language: string;
  text: string;
} & React.ComponentPropsWithoutRef<typeof Button>;

export function TTSButton(props: Props) {
  const { language, text, ...restProps } = props;
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

  // NOTE: This is a workaround for a bug in react-daisyui.
  // eslint-disable-next-line react-compiler/react-compiler
  (restProps as Record<string, string>)['type'] = 'button';

  return (
    <Button
      shape="circle"
      color={recording ? 'error' : 'ghost'}
      size="sm"
      title={recording ? t('Stop reading') : t('Start reading')}
      onClick={onClickTTSBtn}
      {...restProps}
    >
      {recording ? <MdStop size="16" /> : <MdOutlineVolumeUp size="16" />}
    </Button>
  );
}
