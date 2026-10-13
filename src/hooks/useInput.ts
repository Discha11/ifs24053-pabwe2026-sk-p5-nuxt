// src/hooks/useInput.ts
import { ref, type Ref } from "vue";

export interface UseInputReturn<T> {
  value: Ref<T>;
  onValueChange: (newValue: T) => void;
  reset: () => void;
}

export function useInput<T>(initialValue: T): UseInputReturn<T> {
  const value = ref<T>(initialValue) as Ref<T>;

  function onValueChange(newValue: T): void {
    value.value = newValue;
  }

  function reset(): void {
    value.value = initialValue;
  }

  return { value, onValueChange, reset };
}
