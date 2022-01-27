import userEvent from '@testing-library/user-event';
import { findByText, getAllByClassName, getAllByRole, getAllByText, render } from '../../test/test-utils';
import Board from './Board';

describe('Board', () => {

  test('renders a 5 * 6 grid', () => {
    const { container } = render(<Board />);
    const tiles = getAllByRole(container, 'gridcell');
    const rows = getAllByClassName(container, 'row');
    expect(tiles.length).toBe(30);
    expect(rows.length).toBe(6);
  })

  test('press key "a"', async () => {
    const { container } = render(<Board />);
    await userEvent.keyboard('a')
    const result = await findByText(container, 'a');
    expect(result).toBeTruthy();
  })

  test('press keys "xxxxxx"', async () => {
    const { container } = render(<Board />);
    await userEvent.keyboard('xxxxxx');
    const result = getAllByText(container, 'x');
    expect(result.length).toBe(5);
  })

  test('press keys "xxxxxx", then press Backspace', async () => {
    const { container } = render(<Board />);
    await userEvent.keyboard('xxxxxx');
    await userEvent.keyboard('[Backspace]');
    const result = getAllByText(container, 'x');
    expect(result.length).toBe(4);
  })

  test('press keys "xxxxxx", then press Backspace, then press "a"', async () => {
    const { container } = render(<Board />);
    await userEvent.keyboard('xxxxxx');
    await userEvent.keyboard('[Backspace]');
    await userEvent.keyboard('a');
    const result1 = getAllByText(container, 'x');
    const result2 = getAllByText(container, 'a');
    expect(result1.length).toBe(4);
    expect(result2.length).toBe(1);
  })

  test('press keys "apple", then press Enter and the answer is "apple"', async () => {
    const { container } = render(<Board />, { defaultState: { answer: 'apple' } });
    await userEvent.keyboard('apple[Enter]');
    const result = getAllByText(container, /[aple]{1}/i);
    expect(result.every(tile => tile.className.includes('bg-green-500'))).toBeTruthy();
  })

  test('press keys "bread", then press Enter and the answer is "apple"', async () => {
    const { container } = render(<Board />, { defaultState: { answer: 'apple' } });
    await userEvent.keyboard('bread[Enter]');
    const tileB = getAllByText(container, /b/i)
    const tileR = getAllByText(container, /r/i)
    const tileA = getAllByText(container, /a/i);
    const tileE = getAllByText(container, /e/i);
    const tileD = getAllByText(container, /d/i)
    expect(tileB[0].className.includes('bg-gray-700')).toBeTruthy();
    expect(tileR[0].className.includes('bg-gray-700')).toBeTruthy();
    expect(tileA[0].className.includes('bg-yellow-400')).toBeTruthy();
    expect(tileE[0].className.includes('bg-yellow-400')).toBeTruthy();
    expect(tileD[0].className.includes('bg-gray-700')).toBeTruthy();
  })
});
