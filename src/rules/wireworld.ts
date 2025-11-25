import { CellState } from '../types';
import { AutomataRule, countNeighborsInState } from './ruleBase';

/**
 * Wireworld - electronic circuit simulation
 */
export class Wireworld implements AutomataRule {
  name = 'Wireworld';

  computeNextState(current: CellState, neighbors: CellState[]): CellState {
    if (current === CellState.Dead) {
      return CellState.Dead;
    }

    if (current === CellState.ElectronHead) {
      return CellState.ElectronTail;
    }

    if (current === CellState.ElectronTail) {
      return CellState.Conductor;
    }

    if (current === CellState.Conductor) {
      const headNeighbors = countNeighborsInState(neighbors, CellState.ElectronHead);
      return (headNeighbors === 1 || headNeighbors === 2) 
        ? CellState.ElectronHead 
        : CellState.Conductor;
    }

    return current;
  }
}