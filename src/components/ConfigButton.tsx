import { useTranslation } from 'react-i18next';
import { BsFillGearFill } from 'react-icons/bs';

export function ConfigButton() {
  const { t } = useTranslation();
  return (
    <label
      htmlFor="history-record-drawer"
      className="drawer-button btn btn-primary btn-ghost btn-circle"
      title={t('Config')}
    >
      <BsFillGearFill size={20} />
    </label>
  );
}
