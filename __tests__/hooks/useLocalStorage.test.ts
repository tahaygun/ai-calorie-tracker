import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with provided default value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default_value'));
    expect(result.current[0]).toBe('default_value');
  });

  it('should read stored value from localStorage', () => {
    localStorage.setItem('test_number', '42');
    const { result } = renderHook(() => useLocalStorage('test_number', 0));
    expect(result.current[0]).toBe(42);
  });

  it('should update state and write serialized value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_boolean', false));
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem('test_boolean')).toBe('true');
  });

  it('should support function update syntax', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 5));

    act(() => {
      result.current[1](prev => prev + 10);
    });

    expect(result.current[0]).toBe(15);
    expect(localStorage.getItem('counter')).toBe('15');
  });

  it('should handle JSON objects correctly', () => {
    const defaultObj = { name: 'Initial', count: 1 };
    const { result } = renderHook(() => useLocalStorage('test_json', defaultObj));

    expect(result.current[0]).toEqual(defaultObj);

    const updatedObj = { name: 'Updated', count: 2 };
    act(() => {
      result.current[1](updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(localStorage.getItem('test_json') || '{}')).toEqual(updatedObj);
  });
});
