import Board from './Board';
import './App.css';
import useKeyListener from './useKeyListener';
import { useContext, useEffect, useRef, useState } from 'react';
import GameContext from './GameContext';
import { checkFilled, checkInWordList } from './GameProvider';

function App() {
  const { answer, guesses, curRowIndex, finishedRows, result, dispatch } = useContext(GameContext);
  const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
  const curRowIndexRef = useRef(curRowIndex);

  useKeyListener((key: string) => {
    if (key === 'Backspace') {
      dispatch({ type: 'REMOVE_CHARACTER' });
    } else if (key === 'Enter') {
      if (checkFilled(guesses[curRowIndexRef.current]) && !checkInWordList(guesses[curRowIndexRef.current])) {
        alert('not in word list');
        setInvalidRowIndex(curRowIndexRef.current);
      } else {
        dispatch({ type: 'ENTER' });
      }
    } else if (/^[a-z]{1}$/.test(key)) {
      dispatch({ type: 'INPUT_CHARACTER', payload: { char: key } });
    }
  });

  useEffect(() => {
    curRowIndexRef.current = curRowIndex;
  }, [curRowIndex]);

  useEffect(() => {
    if(invalidRowIndex !== -1) {
      setTimeout(() => {
        setInvalidRowIndex(-1);
      }, 1000);
    }
  }, [guesses, invalidRowIndex])

  return (
    <div className="App max-w-screen-2xl m-auto">
      <header >
        <h1 className="font-bold capitalize text-4xl">
          Wordle
        </h1>
      </header>
      <main className='mt-4'>
        <div className="flex flex-col items-center justify-center">
          <Board answer={answer} guesses={guesses} finishedRows={finishedRows} invalidRowIndex={invalidRowIndex} />
        </div>
        {
          result === 'won' && <div className="text-center text-green-500">You won!</div>
        }
        {
          result === 'lost' && <div className="text-center text-red-500">You lost!</div>
        }
      </main>
    </div>
  );
}

export default App;
