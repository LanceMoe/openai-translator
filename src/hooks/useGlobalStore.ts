import { useContext } from 'react';

import { GlobalContext } from '@/components/GlobalStoreContext';

export function useGlobalStore() {
  const value = useContext(GlobalContext);
  if (!value) {
    throw new Error('useGlobalStore must be used within a GlobalProvider');
  }
  return value;
}
