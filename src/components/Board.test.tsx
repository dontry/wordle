import userEvent from '@testing-library/user-event';
import { findByText, getAllByClassName, getAllByRole, getAllByText, render, screen } from '../test/test-utils';
import Board from './Board';

describe('Board', () => {

	test('renders a 5 * 6 grid', () => {
		const { container } = render(<Board />);
		// screen.debug();
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
});
