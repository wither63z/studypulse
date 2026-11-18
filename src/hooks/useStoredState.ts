import { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/storage";

/** useState que se guarda automáticamente en el dispositivo. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadJSON(key, initial).then((v) => {
      setValue(v);
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (loaded) saveJSON(key, value);
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
