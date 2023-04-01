import { useTranslation } from 'react-i18next';
import { BsGearWideConnected } from 'react-icons/bs';

export function ConfigButton() {
  const { t } = useTranslation();
  return (
    <label
      htmlFor="history-record-drawer"
      className="drawer-button btn btn-primary btn-ghost btn-circle"
      title={t('Config')}
    >
      <BsGearWideConnected size={20} />
    </label>
  );
}
