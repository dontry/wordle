import Tile from "./Tile";

interface BoardProps {
  guesses: string[][];
  invalidRowIndex: number;
  finishedRows: boolean[];
  answer: string;
}

const Board: React.FC<BoardProps> = ({
  guesses = [],
  finishedRows = [],
  answer = "",
  invalidRowIndex = -1,
}) => {
  return (
    <div className="grid grid-rows-6 gap-1">
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
    <Tile key={key} status={status}>
      {character}
    </Tile>
  );
}

export default Board;
