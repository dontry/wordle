import React from 'react';
import { getByText, render } from '../../test/test-utils';
import Keyboard from './Keyboard';

describe('Keyboard', () => {
  test('correct key button color', () => {
    const { container } = render(<Keyboard />, { defaultState: {  keyStatuses: { 'a' : 'correct', 'b': 'include', c: 'incorrect'}  } });
    const keyButtonA = getByText(container, 'a');
    const keyButtonB = getByText(container, 'b');
    const keyButtonC = getByText(container, 'c');

    expect(keyButtonA.className).toContain('bg-green-500');
    expect(keyButtonB.className).toContain('bg-yellow-500');
    expect(keyButtonC.className).toContain('bg-gray-700');
  });

});
