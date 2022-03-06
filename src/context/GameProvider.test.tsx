import React from 'react';
import { initializeGuesses } from '../lib/utils';
import { GameAction, initialState, reducer } from './GameProvider';
;

describe('GameProvider', () => {
  describe('reducer', () => {
    describe('action is INPUT_CHARACTER', () => {
      it('should fill an element and update the nextPos', () => {
        const action: GameAction = {
          type: 'INPUT_CHARACTER',
          payload: {
            char: 'a',
          }
        }
        const newState = reducer(initialState, action);
        expect(newState.guesses[0][0]).toBe('a');
        expect(newState.nextPos).toEqual([0, 1]);
      });

      it('should do nothing when the entire row is filled', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['a', 'a', 'a', 'a', 'a'];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
        }
        const action: GameAction = {
          type: 'INPUT_CHARACTER',
          payload: {
            char: 'b',
          }
        }
        const newState = reducer(prevState, action);
        expect(newState.guesses[0]).toEqual(['a', 'a', 'a', 'a', 'a']);
        expect(newState.nextPos).toEqual([0, 4]);
      });
    });

    describe('action is BACKSPACE', () => {
      it('should delete the last character and update the nextPos', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['a', 'a', 'a', 'a', ''];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
        }
        const action: GameAction = {
          type: 'BACKSPACE',
        }
        const newState = reducer(prevState, action);
        expect(newState.guesses[0]).toEqual(['a', 'a', 'a', '', '']);
        expect(newState.nextPos).toEqual([0, 3]);
      });

      it('should do nothing when the current position is at the beginning of the row', () => {
        const prevState = {
          ...initialState,
          nextPos: [0, 0],
        }
        const action: GameAction = {
          type: 'BACKSPACE',
        }
        const newState = reducer(prevState, action);
        expect(newState.nextPos).toEqual([0, 0]);
      });

      it('should delete the last character and the nextPos stays same if the entire row is filled', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['a', 'a', 'a', 'a', 'a'];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
        }
        const action: GameAction = {
          type: 'BACKSPACE',
        }
        const newState = reducer(prevState, action);
        expect(newState.guesses[0]).toEqual(['a', 'a', 'a', 'a', '']);
        expect(newState.nextPos).toEqual([0, 4]);
      });
    });

    describe('ENTER', () => {
      it('should update key statuses and next pos if the word is incorrect', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['s', 't', 'a', 'r', 'e'];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
          answer: 'sting',
        }
        const action: GameAction = {
          type: 'ENTER',
        }
        const newState = reducer(prevState, action);
        expect(newState.keyStatuses).toEqual({'s': 'correct', 't': 'correct', 'a': 'incorrect', 'r': 'incorrect', 'e': 'incorrect'});
        expect(newState.nextPos).toEqual([1, 0]);
      });

      it('should not update if the word is not in the word list', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['a', 'b', 'c', 'd', 'e'];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
          answer: 'sting',
        }
        const action: GameAction = {
          type: 'ENTER',
        }
        const newState = reducer(prevState, action);
        expect(newState).toEqual(prevState);
      });

      it('should update gameState to "won" if the word is correct', () => {
        const prevGuesses = initializeGuesses();
        prevGuesses[0] = ['s', 't', 'a', 'r', 'e'];
        const prevState = {
          ...initialState,
          guesses: prevGuesses,
          nextPos: [0, 4],
          answer: 'stare',
        }
        const action: GameAction = {
          type: 'ENTER',
        }
        const newState = reducer(prevState, action);
        expect(newState.gameStatus).toEqual('won');
      });
    });
  });
});
