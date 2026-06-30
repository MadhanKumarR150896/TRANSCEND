import { useEffect, useState } from "react";

export const useDebounced = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (!value.length) return;
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
};
