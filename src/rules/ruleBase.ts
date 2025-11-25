import { CellState } from '../types';

/**
 * AutomataRule - Base interface for cellular automata rules
 */
export interface AutomataRule {
  name: string;
  computeNextState(current: CellState, neighbors: CellState[], age: number): CellState;
}

/**
 * Count neighbors in a specific state
 */
export function countNeighborsInState(neighbors: CellState[], state: CellState): number {
  return neighbors.filter(s => s === state).length;
}
