'use client';

import { useCallback, useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('local-storage-update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-storage-update', callback);
  };
}

/**
 * Custom React hook for state synchronized with localStorage using useSyncExternalStore.
 * Avoids useEffect setState patterns (eliminates react-hooks/set-state-in-effect lint warnings/errors)
 * and provides SSR-safe initial rendering.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (_value: T | ((_prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  const storeString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: T | ((_prev: T) => T)) => {
      try {
        const currentItem = localStorage.getItem(key);
        const current: T = currentItem !== null ? JSON.parse(currentItem) : initialValue;
        const nextValue = value instanceof Function ? value(current) : value;
        localStorage.setItem(key, JSON.stringify(nextValue));
        window.dispatchEvent(new Event('local-storage-update'));
      } catch (error) {
        console.error(`Error writing key ${key} to localStorage:`, error);
      }
    },
    [key, initialValue]
  );

  let parsed: T;
  try {
    parsed = JSON.parse(storeString);
  } catch {
    parsed = initialValue;
  }

  return [parsed, setValue];
}
