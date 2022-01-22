import React, { Reducer, useReducer } from "react";
import GameContext, { GameContextProps } from "./GameContext";
import words from "../assets/words.json";
import { cloneArrays, getNewKeyStatuses } from '../lib/utils';
import { KeyStatus, Letter, Result, MaybeLetter } from '../types';

const wordList = words?.data;

export interface GameState {
  guesses: MaybeLetter[][];
  nextPos: number[];
  answer: string;
  result: Result;
  keyStatuses: Record<string, KeyStatus>;
}

interface GameAction {
  type: "INPUT_CHARACTER" | "REMOVE_CHARACTER" | "ENTER" | "RESET";
  payload?: {
    char: Letter;
  };
}

const initialState: GameState = {
  guesses: Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => "")),
  nextPos: [0, 0],
  answer: "",
  keyStatuses: {},
  result: "playing",
};

const reducer: Reducer<GameState, GameAction> = (state: GameState, action: GameAction) => {
  const { guesses, nextPos, answer } = state;
  const { type, payload } = action;
  console.log({ action, answer, guesses })
  switch (type) {
    case "INPUT_CHARACTER": {
      const { char } = payload!;
      const newGuesses = cloneArrays<MaybeLetter>(guesses);

      newGuesses[nextPos[0]][nextPos[1]] =
        newGuesses[nextPos[0]][nextPos[1]] === "" ? char : newGuesses[nextPos[0]][nextPos[1]];

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
          result: "won",
        };
      } else if (checkEnd(guesses)) {
        return {
          ...state,
          keyStatuses: newKeyStatuses,
          nextPos: newNextPos,
          result: "lost",
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



export function checkFilled(row: MaybeLetter[] = []) {
  return row.join("").length === 5;
}

export function checkInWordList(row: MaybeLetter[]) {
  return wordList.includes(row.join(""));
}

interface GameProviderProps {
  answer?: string;
}

const GameProvider: React.FC<GameProviderProps> = (props) => {
  const answer = props.answer || words?.data[Math.floor(Math.random() * words.data.length)];
  const [state, dispatch] = useReducer(reducer, { ...initialState, answer: answer });
  const finishedRows = state.guesses.map(
    (row, index) => checkFilled(row) && index < state.nextPos[0],
  );

  const context: GameContextProps = {
    guesses: state.guesses,
    answer: state.answer,
    keyStatuses: state.keyStatuses,
    result: state.result,
    curRowIndex: state.nextPos[0],
    finishedRows,
    dispatch,
  };

  console.log({ context })

  return <GameContext.Provider value={context}>{props.children}</GameContext.Provider>;
};

export default GameProvider;