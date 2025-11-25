import { CellState } from '../types';
import { AutomataRule, countNeighborsInState } from './ruleBase';

/**
 * Brian's Brain - three-state automaton
 */
export class BriansBrain implements AutomataRule {
  name = "Brian's Brain";

  computeNextState(current: CellState, neighbors: CellState[]): CellState {
    const firingNeighbors = countNeighborsInState(neighbors, CellState.Firing);

    if (current === CellState.Firing) {
      return CellState.Dying;
    } else if (current === CellState.Dying) {
      return CellState.Dead;
    } else {
      // Dead cells become firing if exactly 2 neighbors are firing
      return firingNeighbors === 2 ? CellState.Firing : CellState.Dead;
    }
  }
}
