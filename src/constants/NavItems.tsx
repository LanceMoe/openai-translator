import { BsTranslate } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';

const NAV_ITEMS = [
  { key: 'translator', label: 'Translator', to: '/', icon: <BsTranslate size={24} /> },
  { key: 'history', label: 'History records', to: '/history', icon: <FaHistory size={24} /> },
] as const;

export default NAV_ITEMS;
