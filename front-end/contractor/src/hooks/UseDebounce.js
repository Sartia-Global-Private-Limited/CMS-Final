import { useState } from "react";
import { useEffect } from "react";

export function useDebounce(value, delay) {
  const [debounceValue, setDebounce] = useState(value);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timeId);
  }, [value, delay]);

  return debounceValue;
}
