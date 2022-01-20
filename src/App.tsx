import { useContext } from "react";
import GameContext from "./context/GameContext";
import Board from "./components/Board";

import "./App.css";

function App() {
  const { result } = useContext(GameContext);

  return (
    <div className="App max-w-screen-2xl mt-5 mx-auto">
      <header>
        <h1 className="font-bold capitalize text-4xl">Wordle</h1>
      </header>
      <main className="mt-4">
        <div className="flex flex-col items-center justify-center">
          <Board />
        </div>
        <div className="mt-4">
          {result === "won" && <h2 className="text-center text-2xl text-green-500">You won!</h2>}
          {result === "lost" && <h2 className="text-center text-2xl text-red-500">You lost!</h2>}
        </div>
      </main>
    </div>
  );
}

export default App;
