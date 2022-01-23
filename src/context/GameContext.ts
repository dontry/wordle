import {createContext} from "react";
import { GameState } from './GameProvider';

export interface GameContextProps extends Omit<GameState, 'nextPos'> {
  curRowIndex: number;
  latestFilledRowIndex: number;
  dispatch: React.Dispatch<any>;
}

const GameContext = createContext<GameContextProps>({
  guesses: [],
  answer: "",
  gameStatus: "playing",
  curRowIndex: 0,
  latestFilledRowIndex: -1,
  keyStatuses: {},
  dispatch: () => {},
});

export default GameContext;
