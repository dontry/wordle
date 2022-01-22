import { useContext, useState, useRef, useEffect } from 'react';
import GameContext from '../context/GameContext';
import { checkFilled, checkInWordList } from '../context/GameProvider';
import useKeyListener from '../hooks/useKeyListener';
import { getKeyStatus } from '../lib/utils';
import { KeyStatus } from '../types';
import Tile from "./Tile";


const Board: React.FC = () => {
	const { answer, guesses, curRowIndex, finishedRows, dispatch } = useContext(GameContext);
	const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
	const callbackRef = useRef((arg: any) => { })

	useEffect(() => {
		callbackRef.current = (key: string) => {
			if (key === "Backspace") {
				dispatch({ type: "REMOVE_CHARACTER" });
			} else if (key === "Enter") {
				if (
					checkFilled(guesses[curRowIndex]) &&
					!checkInWordList(guesses[curRowIndex])
				) {
					alert("not in word list");
					setInvalidRowIndex(curRowIndex);
				} else {
					dispatch({ type: "ENTER" });
				}
			} else if (/^[a-z]{1}$/.test(key)) {
				dispatch({ type: "INPUT_CHARACTER", payload: { char: key } });
			}
		}
	}, [curRowIndex, guesses]);

	useKeyListener(callbackRef);

	useEffect(() => {
		if (invalidRowIndex !== -1) {
			setTimeout(() => {
				setInvalidRowIndex(-1);
			}, 1000);
		}
	}, [guesses, invalidRowIndex]);

	return (
		<div className="grid grid-rows-6 gap-1" role="grid">
			{guesses.map((row, rowIndex) => {
				const tiles = row.map((character, colIndex) =>
					renderTile(
						character,
						answer,
						colIndex,
						`${rowIndex}-${colIndex}`,
						finishedRows[rowIndex],
					),
				);
				return (
					<div
						key={rowIndex}
						className={"row grid grid-cols-5 gap-1"}
						data-invalid={invalidRowIndex === rowIndex}
					>
						{tiles}
					</div>
				);
			})}
		</div>
	);
};

function renderTile(
	character: string,
	answer: string,
	colIndex: number,
	key: string,
	isFinished: boolean,
) {
	const status: KeyStatus = isFinished ? "empty" : getKeyStatus(character, answer, colIndex);
	return (
		<Tile key={key} index={key} status={status}>
			{character}
		</Tile>
	);
}

export default Board;

