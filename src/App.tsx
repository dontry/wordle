import { useContext } from "react";
import GameContext from "./context/GameContext";
import Board from "./components/Board";

import "./App.css";
import Keyboard from './components/Keyboard';

function App() {
  const { gameStatus: result } = useContext(GameContext);

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
        <section className="mt-4">
          {result === "won" && <h2 className="text-center text-2xl text-green-500">You won!</h2>}
          {result === "lost" && <h2 className="text-center text-2xl text-red-500">You lost!</h2>}
        </section>
        <section>
          <Keyboard />
        </section>
      </main>
    </div>
  );
}

export default App;
