import { BsGearWideConnected, BsTranslate } from 'react-icons/bs';

export const NAV_ITEMS = [
  { key: 'translator', label: 'Translator', to: '/', icon: <BsTranslate size={24} /> },
  { key: 'config', label: 'Config', to: '/config', icon: <BsGearWideConnected size={24} /> },
] as const;

export default NAV_ITEMS;
