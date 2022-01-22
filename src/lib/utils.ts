import { KeyStatus, MaybeLetter } from '../types';

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
