import {createContext} from "react";
import { GameState } from './GameProvider';

export interface GameContextProps extends Omit<GameState, 'nextPos'> {
  curRowIndex: number;
  finishedRows: boolean[];
  dispatch: React.Dispatch<any>;
}

const GameContext = createContext<GameContextProps>({
  guesses: [],
  answer: "",
  result: "playing",
  curRowIndex: 0,
  finishedRows: [],
  keyStatuses: {},
  dispatch: () => {},
});

export default GameContext;
