import { useContext, useState, useRef, useEffect } from 'react';
import GameContext from '../context/GameContext';
import { checkFilled, checkInWordList } from '../context/GameProvider';
import useKeyListener from '../hooks/useKeyListener';
import Tile from "./Tile";


const Board: React.FC = () => {
	const { answer, guesses, curRowIndex, finishedRows, dispatch } = useContext(GameContext);
	const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
	const curRowIndexRef = useRef(curRowIndex);

	useKeyListener((key: string) => {
		if (key === "Backspace") {
			dispatch({ type: "REMOVE_CHARACTER" });
		} else if (key === "Enter") {
			if (
				checkFilled(guesses[curRowIndexRef.current]) &&
				!checkInWordList(guesses[curRowIndexRef.current])
			) {
				alert("not in word list");
				setInvalidRowIndex(curRowIndexRef.current);
			} else {
				dispatch({ type: "ENTER" });
			}
		} else if (/^[a-z]{1}$/.test(key)) {
			dispatch({ type: "INPUT_CHARACTER", payload: { char: key } });
		}
	});

	useEffect(() => {
		curRowIndexRef.current = curRowIndex;
	}, [curRowIndex]);

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
	let status = "";
	if (isFinished) {
		if (character === answer[colIndex]) {
			status = "correct";
		} else if (answer.includes(character) && character !== "") {
			status = "include";
		} else if (character !== "") {
			status = "filled";
		}
	}
	return (
		<Tile key={key} index={key} status={status}>
			{character}
		</Tile>
	);
}

export default Board;
