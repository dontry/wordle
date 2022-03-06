import React, { Reducer } from "react";
import GameContext, { GameContextProps } from "./GameContext";
import wordList from "../assets/words";
import { checkFilled, checkInWordList, cloneArrays, getNewKeyStatuses, initializeGuesses } from '../lib/utils';
import { KeyStatus, Letter, GameStatus, MaybeLetter } from '../types';
import useStateStorage from '../hooks/useStorage';


export interface GameState {
  guesses: MaybeLetter[][];
  nextPos: number[];
  answer: string;
  gameStatus: GameStatus;
  keyStatuses: Record<string, KeyStatus>;
}

export interface GameAction {
  type: "INPUT_CHARACTER" | "BACKSPACE" | "ENTER" | "RESET" | "PAUSE" | "RESUME";
  payload?: {
    char: Letter;
  }
}

export const initialState: GameState = {
  guesses: initializeGuesses(),
  nextPos: [0, 0],
  answer: "",
  keyStatuses: {},
  gameStatus: "playing",
};

export const reducer: Reducer<GameState, GameAction> = (state: GameState, action: GameAction) => {
  const { guesses, nextPos, answer, gameStatus } = state;
  const { type, payload } = action;
  if ((gameStatus === 'paused' || gameStatus === 'lost' || gameStatus === 'won')
    && (type !== 'RESUME' && type !== 'RESET')) {
    return state;
  }
  switch (type) {
    case "INPUT_CHARACTER": {
      const newGuesses = cloneArrays<MaybeLetter>(guesses);

      newGuesses[nextPos[0]][nextPos[1]] =
        newGuesses[nextPos[0]][nextPos[1]] === "" ? payload!.char : newGuesses[nextPos[0]][nextPos[1]];

      let newNextPos = [...nextPos];
      if (nextPosIsValid(nextPos)) {
        ++newNextPos[1];
      }

      return {
        ...state,
        guesses: newGuesses,
        nextPos: newNextPos,
      };
    }
    case "BACKSPACE": {
      const newGuesses = cloneArrays<MaybeLetter>(guesses);
      let newNextPos = [...nextPos];
      if (!nextPosIsValid(nextPos) && newGuesses[nextPos[0]][4]) {
        newGuesses[nextPos[0]][4] = "";
      } else  {
        const row = nextPos[0];
        const col = nextPos[1] - 1 <= 0 ? 0 : nextPos[1] - 1;
        newNextPos = [row, col];
        newGuesses[row][col] = "";
      }
      return {
        ...state,
        nextPos: newNextPos,
        guesses: newGuesses,
      };
    }
    case "ENTER": {
      const newNextPos = [nextPos[0] + 1, 0];
      const newKeyStatuses = getNewKeyStatuses(guesses, answer);
      if (checkGuess(guesses, answer)) {
        return {
          ...state,
          keyStatuses: newKeyStatuses,
          nextPos: newNextPos,
          gameStatus: "won",
        };
      } else if (checkEnd(guesses)) {
        return {
          ...state,
          keyStatuses: newKeyStatuses,
          nextPos: newNextPos,
          gameStatus: "lost",
        };
      } else if (checkFilled(guesses[nextPos[0]]) && checkInWordList(guesses[nextPos[0]])) {
        return {
          ...state,
          keyStatuses: newKeyStatuses,
          nextPos: newNextPos,
        };
      } else {
        return state;
      }
    }
    case "PAUSE": {
      return {
        ...state,
        gameStatus: 'paused',
      }
    }
    case "RESUME": {
      return {
        ...state,
        gameStatus: 'playing',
      }
    }
    case "RESET": {
      const answer = wordList[Math.floor(Math.random() * wordList.length)];
      return {
        ...initialState,
        answer,
      };
    }
    default:
      return state;
  }
};

function nextPosIsValid(nextPos: number[]) {
  return nextPos[1] + 1 < 5;
}


function checkGuess(guesses: MaybeLetter[][], answer: string) {
  return guesses.some((row) => {
    const word = row.join("");
    return word === answer;
  });
}

function checkEnd(guesses: MaybeLetter[][]) {
  return guesses.every((row) => {
    const word = row.join("");
    return word.length === 5;
  });
}
interface GameProviderProps {
  defaultState?: Partial<GameState>
}

const GameProvider: React.FC<GameProviderProps> = (props) => {
  const answer = props.defaultState?.answer || wordList[Math.floor(Math.random() * wordList.length)];
  const initialGameState = { ...initialState, ...props.defaultState, answer };
  const [gameState, dispatch] = useStateStorage('gameState', initialGameState, reducer);
  const latestFilledRowIndex = gameState.nextPos[0] - 1;
  const context: GameContextProps = {
    guesses: gameState.guesses,
    answer: gameState.answer,
    keyStatuses: gameState.keyStatuses,
    gameStatus: gameState.gameStatus,
    curRowIndex: gameState.nextPos[0],
    latestFilledRowIndex,
    dispatch,
  };

  return <GameContext.Provider value={context}>{props.children}</GameContext.Provider>;
};

export default GameProvider;
