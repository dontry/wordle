import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GameContext from "./context/GameContext";
import { Board } from "./components/board";
import { Keyboard } from './components/keyboard';
import Dialog from './components/Dialog';
import classNames from 'classnames';

import "./App.css";
import { checkFilled, getKeyStatus } from './lib/utils';
import { StatusEmoji } from './constants';

function App() {
  const { gameStatus, answer, dispatch, guesses } = useContext(GameContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const resultRef = useRef(gameStatus);
  const dialogClasses = classNames(
    "text-xl text-center font-semibold",
    {
      'text-green-500': resultRef.current === 'won',
      'text-red-500': resultRef.current === 'lost',
    }
  )

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      resultRef.current = gameStatus;
      setDialogOpen(true)
    }
  }, [gameStatus]);

  const handleClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleReset = useCallback(() => {
    setDialogOpen(false)
    dispatch({ type: 'RESET' })
    // Delay text update to allow dialog to close on time
    setTimeout(() => {
      resultRef.current = 'playing';
    }, 300)
  }, [])

  const handleShare = useCallback(() => {
    const result = guesses
      .filter(checkFilled)
      .map(row => {
        return row.map((letter, colIndex) => {
          const status = getKeyStatus(letter, answer, colIndex);
          return StatusEmoji[status];
        }).join('')
      }).join('\n')

    const shareText = "Wordle\n\n" + result;

    navigator.clipboard.writeText(shareText);
  }, [guesses, answer])

  return (
    <div className="App max-w-screen-sm mx-auto grid">
      <header>
        <h1 className="font-bold uppercase mt-5 text-4xl text-center font-semibold pb-2 select-none">Wordle</h1>
        <hr />
      </header>
      <main className="grid grid-flow-row mt-4">
        <section className="flex flex-col items-center justify-center">
          <Board />
        </section>
        <section>
          <Keyboard />
        </section>
        <Dialog open={dialogOpen} onClose={handleClose}>
          <div className="grid justify-center items-center">
            <h1 className={dialogClasses}>{`You ${resultRef.current}!`}</h1>
            {resultRef.current === 'lost' && <p className='mt-3 text-center'>The answer is {answer}.</p>}
            <div className="flex gap-4 content-center" >
              <button
                className="inline-flex justify-center content-center mt-5 mx-auto px-4 py-2 text-sm font-semibold border rounded-md hover:bg-yellow-400 hover:text-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 uppercase"
                onClick={handleReset} >
                Reset
              </button>
              {resultRef.current === 'won' &&<button
                className="inline-flex justify-center content-center mt-5 mx-auto px-4 py-2 text-sm font-semibold border rounded-md hover:bg-green-500 hover:text-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 uppercase"
                onClick={handleShare} >
                Share
              </button>}
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
}

export default App;
