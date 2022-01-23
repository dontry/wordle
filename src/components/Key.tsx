import classNames from 'classnames';
import React from 'react';
import { KeyStatus, KeyType } from '../types';


interface KeyProps {
	char: KeyType;
	status: KeyStatus;
	onClick: (key: string) => void;
}

const Key: React.FC<KeyProps> = ({ char, status, onClick }) => {

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const key = (e.target as HTMLElement).innerText;
		onClick(key);
	}

	return <button className={getKeyClasses(status)} data-key={char} onClick={handleClick}>{char}</button>
};

function getKeyClasses(status: KeyStatus) {
	return classNames(
		"keyboard-key bg-slate-400  capitalize justify-items-center  text-sm sm:text-md md:text-xl font-semibold rounded h-14 align-center select-none cursor-pointer text-white",
		{
			"bg-green-400": status === "correct",
			"bg-yellow-200": status === "include",
			"bg-gray-400": status === "incorrect",
		},
	)
}

export default Key;
