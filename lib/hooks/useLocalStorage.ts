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

function parseStorageValue<T>(raw: string | null, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;

  if (typeof fallback === 'string') {
    if ((raw.startsWith('"') && raw.endsWith('"')) || raw.startsWith('{') || raw.startsWith('[')) {
      try {
        return JSON.parse(raw);
      } catch {
        return raw as unknown as T;
      }
    }
    return raw as unknown as T;
  }

  if (typeof fallback === 'number') {
    const num = Number(raw);
    return (isNaN(num) ? fallback : num) as unknown as T;
  }

  if (typeof fallback === 'boolean') {
    if (raw === 'true') return true as unknown as T;
    if (raw === 'false') return false as unknown as T;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function serializeStorageValue<T>(value: T): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

/**
 * Custom React hook for state synchronized with localStorage using useSyncExternalStore.
 * Handles strings, numbers, booleans, and JSON objects/arrays safely.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (_newValue: T | ((_prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : serializeStorageValue(initialValue);
    } catch {
      return serializeStorageValue(initialValue);
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return serializeStorageValue(initialValue);
  }, [initialValue]);

  const storeString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = parseStorageValue(storeString, initialValue);

  const setValue = useCallback(
    (newValue: T | ((_prev: T) => T)) => {
      try {
        const currentRaw = localStorage.getItem(key);
        const current = parseStorageValue(currentRaw, initialValue);
        const nextValue = newValue instanceof Function ? newValue(current) : newValue;
        localStorage.setItem(key, serializeStorageValue(nextValue));
        window.dispatchEvent(new Event('local-storage-update'));
      } catch (error) {
        console.error(`Error writing key ${key} to localStorage:`, error);
      }
    },
    [key, initialValue]
  );

  return [value, setValue];
}
