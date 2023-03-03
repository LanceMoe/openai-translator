// Hook

import { useCallback, useState } from 'react';

// Parameter is the boolean, with default "false" value
export function useToggle(initialState = false) {
  // Initialize the state
  const [state, setState] = useState<boolean>(initialState);
  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback((): void => setState((state) => !state), []);
  return [state, toggle];
}
