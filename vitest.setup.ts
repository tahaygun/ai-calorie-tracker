import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

// Robust Proxy-backed LocalStorage mock for Vitest JSDOM environment
function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};

  const methods = {
    getItem(key: string): string | null {
      return key in store ? store[key] : null;
    },
    setItem(key: string, value: string): void {
      store[key] = String(value);
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      store = {};
    },
    key(index: number): string | null {
      return Object.keys(store)[index] || null;
    },
  };

  return new Proxy(methods as unknown as Storage, {
    get(target, prop: string | symbol) {
      if (typeof prop === 'string' && prop in methods) {
        return (methods as unknown as Record<string, unknown>)[prop];
      }
      if (prop === 'length') {
        return Object.keys(store).length;
      }
      if (typeof prop === 'string') {
        return store[prop] !== undefined ? store[prop] : null;
      }
      return undefined;
    },
    set(_target, prop: string | symbol, value: unknown) {
      if (typeof prop === 'string') {
        store[prop] = String(value);
      }
      return true;
    },
    deleteProperty(_target, prop: string | symbol) {
      if (typeof prop === 'string') {
        delete store[prop];
      }
      return true;
    },
    ownKeys() {
      return Object.keys(store);
    },
    getOwnPropertyDescriptor(_target, prop: string | symbol) {
      if (typeof prop === 'string' && prop in store) {
        return {
          enumerable: true,
          configurable: true,
          writable: true,
          value: store[prop],
        };
      }
      return undefined;
    },
  });
}

const mockLocalStorage = createLocalStorageMock();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(globalThis, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  }

  if (!URL.createObjectURL) {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  }

  if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = vi.fn();
  }
}

beforeEach(() => {
  localStorage.clear();
});
