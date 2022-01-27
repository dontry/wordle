import userEvent from '@testing-library/user-event';
import App from './App';
import { initializeGuesses } from './lib/utils';
import { getAllByText, getByText, queryAllByText, render, screen } from './test/test-utils';

jest.mock('./components/Dialog', () => ({
  __esModule: true,
  default: (props: any) => <div>{props.children}</div>
}));

describe('App', () => {
  test('prompt "You won" when the game status is "won"', () => {
    const { container } = render(<App />, { defaultState: { gameStatus: 'won' } });
    const result = getByText(container, /you won/i);
    expect(result.textContent).toBeTruthy();
  })

  test('prompt "You lost" when the game status is "lost"', () => {
    const { container } = render(<App />, { defaultState: { gameStatus: 'lost' } });
    const result = getByText(container, /you lost/i);
    expect(result).toBeTruthy();
  })

  test('user clicks reset button to clear the board', () => {
    const guesses = initializeGuesses();
    guesses[0] = ['a', 'p', 'p', 'l', 'e'];
    const { container } = render(<App />, { defaultState: { gameStatus: 'won', guesses, answer: 'apple' } });
    const result =  getAllByText(container, /^[aple]{1}$/i, {selector: '[role=gridcell]'});
    expect(result.length).toBe(5);
    const resetButton = getByText(container, /reset/i);
    userEvent.click(resetButton);

    const result2 =  queryAllByText(container, /^[aple]{1}$/i, {selector: '[role=gridcell]'});
    expect(result2.length).toBe(0);
  })
});
