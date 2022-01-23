import { useContext, useRef, useEffect } from 'react';
import GameContext from '../context/GameContext';
import useKeyListener from '../hooks/useKeyListener';
import { checkFilled, checkInWordList, getKeyStatus, handleKeyPress } from '../lib/utils';
import { KeyStatus, KeyType } from '../types';
import Tile from "./Tile";


const Board: React.FC = () => {
	const { answer, guesses, curRowIndex, latestFilledRowIndex, gameStatus, dispatch } = useContext(GameContext);
	const callbackRef = useRef((arg: any) => { })

	useEffect(() => {
		callbackRef.current = (key: string) => {
			key = key.toLowerCase();
			handleKeyPress(
				key as KeyType,
				guesses,
				curRowIndex,
				dispatch,
				() => {
					if (
						checkFilled(guesses[curRowIndex]) &&
						!checkInWordList(guesses[curRowIndex])
					) {
						alert('Not in the word list');
						dispatch({ type: 'PAUSE' });
						setTimeout(() => {
							dispatch({ type: 'RESUME' });
						}, 500);
					} else {
						dispatch({ type: "ENTER" });
					}
				}
			)
		}
	}, [curRowIndex, guesses]);

	useKeyListener(callbackRef);


	return (
		<div className="grid grid-rows-6 gap-1" role="grid">
			{guesses.map((row, rowIndex) => {
				const tiles = row.map((character, colIndex) =>
					renderTile(
						character,
						answer,
						colIndex,
						rowIndex <= latestFilledRowIndex,
					),
				);
				return (
					<div
						key={rowIndex}
						className={"row grid grid-cols-5 gap-1"}
						data-invalid={gameStatus === 'paused' && rowIndex === latestFilledRowIndex + 1}
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
	isFinished: boolean,
) {
	const status: KeyStatus = isFinished ? getKeyStatus(character, answer, colIndex) : "empty";
	return (
		<Tile key={colIndex} status={status}>
			{character}
		</Tile>
	);
}

export default Board;

