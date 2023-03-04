import { FaHistory } from 'react-icons/fa';

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
