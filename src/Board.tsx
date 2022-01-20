import classNames from 'classnames';
import Tile from './Tile';

const tiles = Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => ''));

tiles[0] = ['A', 'P', 'C', 'P', 'E'];

interface BoardProps {
	guesses: string[][];
	invalidRowIndex: number;
	finishedRows: boolean[];
	answer: string;
}

const Board: React.FC<BoardProps> = ({ guesses = [], finishedRows = [], answer = '', invalidRowIndex = -1 }) => {
	return <div className="grid grid-rows-6 gap-1">
		{guesses.map((row, rowIndex) => {

			const tiles = row.map((character, colIndex) => {
				let status = '';
				if (finishedRows[rowIndex]) {
					if (character === answer[colIndex]) {
						status = 'correct';
					} else if (answer.includes(character) && character !== '') {
						status = 'include';
					} else if (character !== '') {
						status = 'filled';
					}
				}
				return <Tile key={`${rowIndex}-${colIndex}`} status={status}>{character}</Tile>
			})

			return <div key={rowIndex} className={"row grid grid-cols-5 gap-1"} data-invalid={invalidRowIndex === rowIndex}>{tiles}</div>
		})}
	</div>;
};

export default Board;
