import { useContext } from 'react';
import classNames from 'classnames';
import GameContext from '../context/GameContext';
import { KeyStatus } from '../types';
import './keyboard.css';

const keyMap = [
	['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
	['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
	['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
]

const Keyboard = () => {
	const { keyStatuses } = useContext(GameContext);
	const keyRowClasses = "keyboard-row grid grid-flow-col gap-2 justify-content-stretch";
	const getKeyClasses = (status: KeyStatus) => classNames(
		"keyboard-key bg-gray-400 capitalize justify-items-center  text-sm sm:text-md md:text-xl font-semibold rounded h-14 align-center select-none cursor-pointer text-white",
		{
			"bg-green-400": status === "correct",
			"bg-yellow-200": status === "include",
			"bg-slate-300": status === "incorrect",
		},
	);

	return (<div className="keyboard grid gap-2 p-3">
		{keyMap.map((row, i) => {
			return <div className={keyRowClasses} key={i}>
				{row.map((key, j) => {
					const status = keyStatuses[key];
					return <button className={getKeyClasses(status)} data-key={key} key={j}>{key}</button>
				})}
			</div>
		})}
	</div>)
}

export default Keyboard;
