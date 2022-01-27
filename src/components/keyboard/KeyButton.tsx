import classNames from 'classnames';
import React, { memo } from 'react';
import { KeyStatus, KeyType } from '../../types';


interface KeyProps {
  char: KeyType;
  status: KeyStatus;
  onClick: (key: string) => void;
}

const KeyButton: React.FC<KeyProps> = ({ char, status, onClick }) => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const key = (e.target as HTMLElement).innerText;
    onClick(key);
  }

  return <button aria-label={char} className={getKeyClasses(status)} data-key={char} onClick={handleClick}>{char}</button>
};

function getKeyClasses(status: KeyStatus) {
  return classNames(
    "keyboard-key   capitalize justify-items-center  text-sm sm:text-md md:text-xl font-semibold rounded h-14 align-center select-none cursor-pointer text-white",
    {
      "bg-slate-400": status === 'empty',
      "bg-green-500": status === "correct",
      "bg-yellow-500": status === "include",
      "bg-gray-700": status === "incorrect",
    },
  )
}

export default memo(KeyButton);
