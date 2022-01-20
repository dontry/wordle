import {useEffect, useState} from "react";

function useKeyListener(callback: (key: string) => void) {
  const [key, setKey] = useState("");
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      setKey(e.key);
      callback(e.key);
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  return key;
}

export default useKeyListener;
