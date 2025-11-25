import { CellState } from '../types';
import { AutomataRule, countNeighborsInState } from './ruleBase';

/**
 * Seeds - high-growth pattern generator
 */
export class Seeds implements AutomataRule {
  name = 'Seeds';

  computeNextState(current: CellState, neighbors: CellState[]): CellState {
    const aliveNeighbors = countNeighborsInState(neighbors, CellState.Alive);

    if (current === CellState.Alive) {
      return CellState.Dead;
    } else {
      return aliveNeighbors === 2 ? CellState.Alive : CellState.Dead;
    }
  }
}