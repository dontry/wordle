import { Reducer, useReducer } from 'react';

interface useStorageOption {
  storage: Storage
}

function useStateStorage<T>(key: string, initialValue: any, reducer: Reducer<any, any>, option: useStorageOption = { storage: window.localStorage }) {
  const { storage } = option;
  let initialState;
  try {
    const item = storage.getItem(key);
    initialState = item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    initialState = initialValue === 'function' ? initialValue() : initialValue;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  storage.setItem(key, JSON.stringify(state));

  return [state, dispatch];
}

export default useStateStorage;
