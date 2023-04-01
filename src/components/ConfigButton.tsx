import { BsGearWideConnected } from 'react-icons/bs';

export function ConfigButton() {
  return (
    <label
      htmlFor="history-record-drawer"
      className="drawer-button btn btn-primary btn-ghost btn-circle"
      title="Config"
    >
      <BsGearWideConnected size={20} />
    </label>
  );
}
