import { useCallback, useContext, useEffect, useState } from "react";
import GameContext from "./context/GameContext";
import Board from "./components/Board";
import Keyboard from './components/Keyboard';
import Dialog from './components/Dialog';
import classNames from 'classnames';

import "./App.css";

function App() {
  const { gameStatus: result, answer } = useContext(GameContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogClasses = classNames(
    "text-xl text-center font-semibold",
    {
      'text-green-500': result === 'won',
      'text-red-500': result === 'lost',
    }
  )

  useEffect(() => {
    if (result === 'won' || result === 'lost') {
      setDialogOpen(true)
    }
  }, [result]);

  const handleClose = useCallback(() => {
    setDialogOpen(false)
  }, [])


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
            <h1 className={dialogClasses}>{`You ${result}!`}</h1>
            {result === 'lost' &&  <p className='mt-3 text-center'>The answer is {answer}.</p>}
          </div>
        </Dialog>
      </main>
    </div>
  );
}

export default App;
