import { useCallback, useContext } from 'react';
import GameContext from '../context/GameContext';
import { KeyType } from '../types';
import './keyboard.css';
import Key from './Key';
import { checkFilled, checkInWordList, handleKeyPress } from '../lib/utils';

const keyMap: KeyType[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
]

const Keyboard = () => {
  const { keyStatuses, guesses, curRowIndex, dispatch } = useContext(GameContext);
  const keyRowClasses = "keyboard-row grid grid-flow-col gap-2 justify-content-stretch";

  const handleKeyClick = useCallback((key: string) => {
    key = key.toLowerCase();
    handleKeyPress(
      key as KeyType,
      guesses,
      curRowIndex,
      dispatch,
    )
  }, [dispatch]);

  const handleEnterKeyClick = useCallback((key: string) => {
    key = key.toLowerCase();
    handleKeyPress(
      key as KeyType,
      guesses,
      curRowIndex,
      dispatch,
      () => {
        if (
          checkFilled(guesses[curRowIndex]) &&
          !checkInWordList(guesses[curRowIndex])
        ) {
          dispatch({ type: 'PAUSE' });
          setTimeout(() => {
            dispatch({ type: 'RESUME' });
          }, 500);
        } else {
          dispatch({ type: "ENTER" });
        }
      }
    )
  }, [curRowIndex, guesses, dispatch]);

  return (<div className="keyboard grid gap-2 p-3">
    {keyMap.map((row, i) => {
      return <div className={keyRowClasses} key={i}>
        {row.map((key, j) => {
          const status = keyStatuses[key] || 'empty';
          const handleClick = key === 'enter' ? handleEnterKeyClick : handleKeyClick;
          return <Key key={key} status={status} char={key} onClick={handleClick} />
        })}
      </div>
    })}
  </div>)
}

export default Keyboard;
