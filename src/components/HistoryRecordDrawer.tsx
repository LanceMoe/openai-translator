import { FaHistory, FaRegWindowClose } from 'react-icons/fa';

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

  return (
    <>
      <input id="history-record-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="history-record-drawer" className="drawer-overlay"></label>
        <div className="p-4 w-[28.75rem] max-w-[100vw] bg-base-100">
          <h1 className="flex justify-between w-full text-2xl font-bold align-middle">
            <span className="leading-[48px]">History Record</span>
            <label
              htmlFor="history-record-drawer"
              className="drawer-button btn btn-primary btn-ghost btn-circle"
              title="Close History Record Drawer"
            >
              <FaRegWindowClose size={20} />
            </label>
          </h1>

          <ul className="menu text-base-content">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
