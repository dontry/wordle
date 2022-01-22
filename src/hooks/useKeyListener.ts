import {useEffect, useState} from "react";

function useKeyListener(callbackRef: React.MutableRefObject<(arg: any) => void>) {
  const [key, setKey] = useState("");
  let listener: (e: KeyboardEvent) => void;
  useEffect(() => {
     listener = (e: KeyboardEvent) => {
      setKey(e.key);
      callbackRef.current(e.key);
    };
    window.addEventListener("keydown", listener);
    return cleanup;
  }, []);

  const cleanup = () => window.removeEventListener("keydown", listener);
  return key;
}

export default useKeyListener;
