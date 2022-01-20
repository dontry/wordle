import { createContext } from 'react';


export interface GameContextProps {
	guesses: string[][];
	answer: string;
	curRowIndex: number;
	finishedRows: boolean[],
	result: string;
	dispatch: React.Dispatch<any>;
}


const GameContext = createContext<GameContextProps>({
	guesses: [],
	answer: '',
	result: '',
	curRowIndex: 0,
	finishedRows: [],
	dispatch: () => { }
})

export default GameContext;
