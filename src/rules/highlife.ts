import { CellState } from '../types';
import { AutomataRule, countNeighborsInState } from './ruleBase';

/**
 * HighLife - Game of Life variant with replication
 */
export class HighLife implements AutomataRule {
  name = 'HighLife';

  computeNextState(current: CellState, neighbors: CellState[]): CellState {
    const aliveNeighbors = countNeighborsInState(neighbors, CellState.Alive);

    if (current === CellState.Alive) {
      return (aliveNeighbors === 2 || aliveNeighbors === 3) 
        ? CellState.Alive 
        : CellState.Dead;
    } else {
      return (aliveNeighbors === 3 || aliveNeighbors === 6) 
        ? CellState.Alive 
        : CellState.Dead;
    }
  }
}