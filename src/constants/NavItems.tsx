import { BiBook, BiCustomize } from 'react-icons/bi';

export const NAV_ITEMS = [
  { key: 'translator', label: 'Translator', to: '/', icon: <BiBook size={24} /> },
  { key: 'config', label: 'Config', to: '/config', icon: <BiCustomize size={24} /> },
] as const;

export default NAV_ITEMS;
