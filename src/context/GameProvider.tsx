import React, { Reducer, useReducer } from "react";
import GameContext, { GameContextProps } from "./GameContext";
import wordList from "../assets/words";
import { checkFilled, checkInWordList, cloneArrays, getNewKeyStatuses } from '../lib/utils';
import { KeyStatus, Letter, GameStatus, MaybeLetter } from '../types';


export interface GameState {
  guesses: MaybeLetter[][];
  nextPos: number[];
  answer: string;
  gameStatus: GameStatus;
  keyStatuses: Record<string, KeyStatus>;
}

interface GameAction {
  type: "INPUT_CHARACTER" | "REMOVE_CHARACTER" | "ENTER" | "RESET" | "PAUSE" | "RESUME";
  payload?: {
    char: Letter;
  } & {
    status: GameStatus;
  };
}

const initialState: GameState = {
  guesses: Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => "")),
  nextPos: [0, 0],
  answer: "",
  keyStatuses: {},
  gameStatus: "playing",
};

const reducer: Reducer<GameState, GameAction> = (state: GameState, action: GameAction) => {
  const { guesses, nextPos, answer, gameStatus } = state;
  const { type, payload } = action;
  if (gameStatus === 'paused' && type !== 'RESUME' || gameStatus === 'lost' || gameStatus === 'won') {
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
    case "REMOVE_CHARACTER": {
      const newGuesses = cloneArrays<MaybeLetter>(guesses);
      let newNextPos = [...nextPos];
      if (!nextPosIsValid(nextPos) && newGuesses[nextPos[0]][4]) {
        newGuesses[nextPos[0]][4] = "";
      } else {
        newGuesses[nextPos[0]][nextPos[1] - 1] = "";
        newNextPos = [nextPos[0], nextPos[1] - 1];
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
      return initialState;
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
  answer?: string;
}

const GameProvider: React.FC<GameProviderProps> = (props) => {
  const answer = props.answer || wordList[Math.floor(Math.random() * wordList.length)];
  const [state, dispatch] = useReducer(reducer, { ...initialState, answer: answer });
  const latestFilledRowIndex = state.nextPos[0] - 1;

  const context: GameContextProps = {
    guesses: state.guesses,
    answer: state.answer,
    keyStatuses: state.keyStatuses,
    gameStatus: state.gameStatus,
    curRowIndex: state.nextPos[0],
    latestFilledRowIndex,
    dispatch,
  };

  return <GameContext.Provider value={context}>{props.children}</GameContext.Provider>;
};

export default GameProvider;