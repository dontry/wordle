import { useContext, useRef, useEffect, useState } from 'react';
import GameContext from '../context/GameContext';
import useKeyListener from '../hooks/useKeyListener';
import { checkFilled, checkInWordList, getKeyStatus, handleKeyPress } from '../lib/utils';
import { KeyStatus, KeyType } from '../types';
import Dialog from './Dialog';
import Tile from "./Tile";


const Board: React.FC = () => {
  const { answer, guesses, curRowIndex, latestFilledRowIndex, gameStatus, dispatch } = useContext(GameContext);
  const callbackRef = useRef((arg: any) => { })
  const [dialogOpen, setDialogOpen] = useState(false);

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
            setDialogOpen(true);
            dispatch({ type: 'PAUSE' });
          } else {
            dispatch({ type: "ENTER" });
          }
        }
      )
    }
  }, [curRowIndex, guesses]);

  useKeyListener(callbackRef);

  const handleClose = () => {
    setDialogOpen(false);
  }

  const handleConfirm = () => {
    setDialogOpen(false);
    setTimeout(() => {
      dispatch({ type: 'RESUME' });
    }, 500);
  }

  return (
    <>
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
          const label = row.join('');

          return (
            <div
              aria-label={label}
              key={rowIndex}
              className={"row grid grid-cols-5 gap-1"}
              data-invalid={gameStatus === 'paused' && rowIndex === latestFilledRowIndex + 1}
            >
              {tiles}
            </div>
          );
        })}
      </div>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <div className="grid justify-center">
          <p className="text-xl font-semibold">Not in the word list</p>
          <button
            className="inline-flex justify-center content-center mt-5 mx-auto px-4 py-2 text-sm font-medium   border rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
            onClick={handleConfirm} >
            OK
          </button>
        </div>
      </Dialog>
    </>
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

