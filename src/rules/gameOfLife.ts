import { CellState } from '../types';
import { AutomataRule, countNeighborsInState } from './ruleBase';

/**
 * Conway's Game of Life
 */
export class GameOfLife implements AutomataRule {
  name = 'Game of Life';

  computeNextState(current: CellState, neighbors: CellState[]): CellState {
    const aliveNeighbors = countNeighborsInState(neighbors, CellState.Alive);

    if (current === CellState.Alive) {
      // Survival: 2 or 3 neighbors
      return (aliveNeighbors === 2 || aliveNeighbors === 3) 
        ? CellState.Alive 
        : CellState.Dead;
    } else {
      // Birth: exactly 3 neighbors
      return aliveNeighbors === 3 ? CellState.Alive : CellState.Dead;
    }
  }
}