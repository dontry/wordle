import React, {Reducer, useReducer} from "react";
import GameContext, {GameContextProps} from "./GameContext";
import words from "../assets/words.json";

const wordList = words?.data;

interface GameState {
  guesses: string[][];
  nextPos: number[];
  answer: string;
  result: "playing" | "won" | "lost";
}

interface GameAction {
  type: "INPUT_CHARACTER" | "REMOVE_CHARACTER" | "ENTER" | "RESET";
  payload?: {
    char: string;
  };
}

const initialState: GameState = {
  guesses: Array.from({length: 6}, (_, i) => Array.from({length: 5}, (_, j) => "")),
  nextPos: [0, 0],
  answer: "",
  result: "playing",
};

const reducer: Reducer<GameState, GameAction> = (state: GameState, action: GameAction) => {
  const {guesses, nextPos, answer} = state;
  const {type, payload} = action;
	console.log({action, answer, guesses})
  switch (type) {
    case "INPUT_CHARACTER": {
      const {char} = payload!;
      const newGuesses = cloneArrays(guesses);

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
      const newGuesses = cloneArrays(guesses);
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
      if (checkGuess(guesses, answer)) {
        return {
          ...state,
          nextPos: newNextPos,
          result: "won",
        };
      } else if (checkEnd(guesses)) {
        return {
          ...state,
          nextPos: newNextPos,
          result: "lost",
        };
      } else if (checkFilled(guesses[nextPos[0]]) && checkInWordList(guesses[nextPos[0]])) {
        return {
          ...state,
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

function checkGuess(guesses: string[][], answer: string) {
  return guesses.some((row) => {
    const word = row.join("");
    return word === answer;
  });
}

function checkEnd(guesses: string[][]) {
  return guesses.every((row) => {
    const word = row.join("");
    return word.length === 5;
  });
}

function cloneArrays(arrays: any[][]) {
	return arrays.map((array) => [...array]);
}

export function checkFilled(row: string[] = []) {
  return row.join("").length === 5;
}

export function checkInWordList(row: string[]) {
  return wordList.includes(row.join(""));
}

interface GameProviderProps {
	answer?: string;
}

const GameProvider: React.FC<GameProviderProps> = (props) => {
  const answer = props.answer || words?.data[Math.floor(Math.random() * words.data.length)];
  const [state, dispatch] = useReducer(reducer, {...initialState, answer: answer});
  const finishedRows = state.guesses.map(
    (row, index) => checkFilled(row) && index < state.nextPos[0],
  );

  const context: GameContextProps = {
    guesses: state.guesses,
    answer: state.answer,
    result: state.result,
    curRowIndex: state.nextPos[0],
    finishedRows,
    dispatch,
  };

  return <GameContext.Provider value={context}>{props.children}</GameContext.Provider>;
};

export default GameProvider;
