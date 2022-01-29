import { Dispatch } from 'react';
import { KeyStatus, KeyType, MaybeLetter } from '../types';
import wordList from "../assets/words";

export function getKeyStatus(character: string, answer: string, colIndex: number): KeyStatus {
	if (character === answer[colIndex]) {
		return "correct";
	} else if (answer.includes(character) && character !== "") {
		return "include";
	} else if (character !== "") {
		return "incorrect";
	}
	return 'empty';
}

export function getNewKeyStatuses(guesses: MaybeLetter[][], answer: string) {
	let keyStatuses: Record<string, KeyStatus> = {}
	guesses
		.filter(row => row.join('').length === 5)
		.forEach(row => {
			row.forEach((char, index) => {
				keyStatuses[char] = getKeyStatus(char, answer, index);
			})
		})

	return keyStatuses;
}

export function cloneArrays<T>(arrays: T[][]) {
	return arrays.map((array) => [...array]);
}

export function checkFilled(row: MaybeLetter[] = []) {
	return row.join("").length === 5;
}


export function checkInWordList(row: MaybeLetter[]) {
	return wordList?.includes(row.join(""));
}

export function handleKeyPress(key: KeyType, guesses: MaybeLetter[][], curRowIndex: number, dispatch: Dispatch<any>, pressEnterCallback?: () => void) {
	if (key === "backspace" || key === "⌫") {
		dispatch({ type: "BACKSPACE" });
	} else if (key === "enter") {
		pressEnterCallback?.();
	} else if (/^[a-z]{1}$/.test(key)) {
		dispatch({ type: "INPUT_CHARACTER", payload: { char: key } });
	}
}

export function initializeGuesses(): MaybeLetter[][] {
  return Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => ""));
}
